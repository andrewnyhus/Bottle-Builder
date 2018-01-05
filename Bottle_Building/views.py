from .models import *
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, logout
from django.contrib.auth import login as auth_login
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.cache import never_cache
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import json
import re
import smtplib
from email.mime.text import MIMEText
from .email_account import *

# ===============================================================================
# Miscellaneous
# ===============================================================================
@never_cache
@ensure_csrf_cookie
def home(request):

	try:
		# initialize all design collections to None
		user_designs = None
		member_designs = None
		public_designs = None
		buildings = None

		user_is_member = False

		# populate building_designs
		# --------------------------------------------------------------------------
		# if user is authenticated, add user and member-visible designs to the mix of results
		if request.user.is_active and request.user.is_authenticated:
			user_designs = Bottle_Building.objects.filter(created_by=request.user)
			member_designs = Bottle_Building.objects.filter(visible_to_members=True)
			user_is_member = True

		# add public designs to the mix
		public_designs = Bottle_Building.objects.filter(visible_to_public=True)

		# if user is member, include user and member designs with public user_designs
		# and sort them by date
		if user_is_member:
			buildings = (public_designs | user_designs | member_designs).distinct().order_by('-created_on')[:15]

		# else, sort public designs
		else:
			buildings = public_designs.order_by("-created_on")[:15]
		# --------------------------------------------------------------------------

		# declare an array for building_designs
		building_designs = []

		# include coordinates
		# --------------------------------------------------------------------------

		# iterate through buildings created by user
		for building in buildings.all():
			# get coordinates
			design_coordinates = Coordinates.objects.filter(bottle_building=building)

			# get link for current design
			link = request.build_absolute_uri("/view_bottle_building/building_id=" + str(building.pk))

			# add building design to array
			building_designs.append({"building": building, "coordinates": design_coordinates, "link": link})
		# --------------------------------------------------------------------------


		return render(request, 'home.html', {"building_designs": building_designs})
	except Exception as exc:
		return render(request, "error.html", {"exception": str(exc)})


def about(request):
    return render(request, "about.html")

def send_email(recipient, subject, message_body):
    # help from http://www.tutorialspoint.com/python3/python_sending_email.htm
    # help from https://docs.python.org/2/library/email-examples.html
    # help from https://stackoverflow.com/questions/10147455/how-to-send-an-email-with-gmail-as-provider-using-python/12424439#12424439

    try:
        sender = get_email_address()

        # compose message
        message = MIMEText(message_body)
        message["Subject"] = subject
        message["From"] = sender
        message["To"] = recipient

        # connect to server, send message and quit
        smtp_object = smtplib.SMTP("smtp.gmail.com", 587)
        smtp_object.starttls()
        smtp_object.login(sender, get_password())
        smtp_object.sendmail(sender, recipient, message.as_string())
        smtp_object.quit()

        return "Email sent successfully."
    except SMTPException:
        return "Error: unable to send email."
    except Exception as exc:
        return "Exception sending an email"

# ===============================================================================
# ===============================================================================


# ===============================================================================
# Login/Logout
# ===============================================================================
@never_cache
@ensure_csrf_cookie
def login_page(request):
    if request.user.is_authenticated and request.user.is_active:
        return redirect(view_profile)
    return render(request, 'login_page.html')

@api_view(['POST'])
@permission_classes((AllowAny, ))
def login(request):
    username = request.data["username"]
    password = request.data["password"]

    user = authenticate(username=username, password=password)

	# is user exists and password is correct
    if user is not None:
        auth_login(request, user)

        # if user is not active, make them active
        if(not(user.is_active)):
            user.is_active = True
            user.save()

        return Response("Logged in Successfully", status=status.HTTP_200_OK)

    return Response("Login Failed", status=status.HTTP_400_BAD_REQUEST)

def logout_page(request):
	logout(request)
	return render(request, "logout_successful.html")


@never_cache
@ensure_csrf_cookie
def forgot_credentials_page(request):
	return render(request, 'forgot_credentials.html')

# ===============================================================================
# ===============================================================================




# ===============================================================================
# Create Account, Create Account Page, Forgot Password, View Profile
# ===============================================================================
@never_cache
@ensure_csrf_cookie
def create_account_page(request):
    if request.user.is_authenticated and request.user.is_active:
        return redirect(view_profile)
    return render(request, "create_account.html")



@api_view(['POST'])
@permission_classes((AllowAny, ))
def create_account(request):


	try:
		# if user with requested username exists
		# give response that explains so
		user_who_took_username = User.objects.get(username=request.data["username"])
		return Response("That username is taken.", status=status.HTTP_400_BAD_REQUEST)
	except User.DoesNotExist:

		# since user with requested username does not exist
		# look for user with requested email
		# if user with requested email is found
		# return response that explains so

		try:
			user_with_email = User.objects.get(email=request.data["email"])
			return Response("An account exists with that e-mail address.", status=status.HTTP_400_BAD_REQUEST)
		except User.DoesNotExist:
			# otherwise, make sure that the
			# username, password, and email are all valid
			# if they are, create user, if not respond accordingly

			# check length of email
			if not( ((len(request.data['email']) >= 5) and (len(request.data['email']) <= 50))
					and request.data['email'].count("@") == 1
					and request.data['email'].count(".") > 0):
				return Response("E-mail is invalid, it's length must be between 5 and 50 characters, it must have a single '@', and at least one '.'", status=status.HTTP_400_BAD_REQUEST)

			# check length of username
			if not( len(request.data['username']) >= 5 and len(request.data['username']) <= 30):
				return Response("Username is invalid, it's length must be between 5 and 30 characters.", status=status.HTTP_400_BAD_REQUEST)

			# check username for invalid characters
			regex = re.compile("[a-z]|[A-Z]|[0-9]|[_]|[-]")
			regex_result = "".join(regex.findall(request.data["username"]))
			if not(regex_result == request.data["username"]):
				return Response("Username contains invalid characters, only use letters, numbers, underscores and dashes", status=status.HTTP_400_BAD_REQUEST)

			# check length of password
			if not(len(request.data['password']) >= 5 and len(request.data['password']) <= 30):
				return Response("Password length must be between 5 and 30 characters", status=status.HTTP_400_BAD_REQUEST)

			# everything is okay, we must store user
			# and sent a response that it was successful

			user = User.objects.create(username=request.data["username"], email=request.data["email"])
			user.set_password(request.data['password'])

			user.is_active = False
			user.save()



			return Response("Account Created Successfully, Please Activate Your Account", status=status.HTTP_201_CREATED)


@never_cache
@ensure_csrf_cookie
def view_profile(request):
    if request.user.is_authenticated and request.user.is_active:

        buildings = Bottle_Building.objects.filter(created_by=request.user).order_by("-created_on")
        # initialize designs array
        building_designs = []
        # iterate through buildings created by user
        for building in buildings.all():
            # get coordinates
            design_coordinates = Coordinates.objects.filter(bottle_building=building)
            # get link for current design
            link = request.build_absolute_uri("/view_bottle_building/building_id=" + str(building.pk))
            # add building design to array
            building_designs.append({"building": building, "coordinates": design_coordinates, "link": link})

        return render(request, "profile.html", {"building_designs": building_designs})
    return render(request, "login_page.html")
# ===============================================================================
# ===============================================================================



# ===============================================================================
# Get Bottle Buildings, View Bottle Building, Design Bottle Building
# ===============================================================================
# ALLOW FOR DELETING BOTTLE BUILDINGS


@never_cache
@ensure_csrf_cookie
def view_bottle_building(request, building_id):


	try:
		building = Bottle_Building.objects.get(pk=building_id)

		# if user is unauthenticated
		# building must be visible to public or to those with the link
		# otherwise, respond saying that the user is unauthorized
		if not(request.user.is_authenticated) and not(building.visible_to_public or building.visible_to_those_with_link):
			return render(request, "unauthorized_request.html")

		# if user is authenticated
		# building must be visible to public, members or those with the link, or it must be created by user
		# otherwise, respond saying that the user is unauthorized
		if request.user.is_authenticated and not(building.visible_to_public or building.visible_to_members or building.visible_to_those_with_link or (request.user.pk == building.created_by.pk)):
			return render(request, "unauthorized_request.html")

		coordinates = Coordinates.objects.filter(bottle_building=building)
		link = request.build_absolute_uri("/view_bottle_building/building_id=" + str(building.pk))

		return render(request, "view_bottle_building.html", {"building": building, "coordinates": coordinates, "link": link})
	except Exception as exc:
		return render(request, "error.html", {"exception": str(exc)})


@never_cache
@ensure_csrf_cookie
def design_bottle_building(request):
	return render(request, "design_bottle_building.html", {"use_imperial_system": True})



@api_view(['POST'])
def delete_bottle_building_design(request, building_id):
	try:
		building = Bottle_Building.objects.get(pk=building_id)
		if request.user.is_authenticated and request.user.is_active and (request.user.pk == building.created_by.pk):
			building.delete()
			return Response("Successfully Deleted", status=status.HTTP_200_OK)
		return Response("Could not delete building because you are unauthorized", status=status.HTTP_401_UNAUTHORIZED)
	except Exception as exc:
		return Response("Error deleting bottle building.  Make sure the proper id was provided.", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def post_bottle_building_design(request):

	if request.user.is_authenticated and request.user.is_active:
		coordinate_array = list()

		title = None

		bottle_estimate = None
		cement_estimate = None
		fill_estimate = None

		bottle_estimate_units = None
		cement_estimate_units = None
		fill_estimate_units = None

		walls = list()

		data_string = request.data["data_string"]
		request_data = json.loads(data_string)


		#----------------------------------------------------------------------------------

		try:
			# get title
			title = request_data["title"]
			# get units of resource estimation
			bottle_estimate_units = request_data["resource_estimate"]["bottle_units"]
			cement_estimate_units = request_data["resource_estimate"]["cement_units"]

			fill_estimate_units = request_data["resource_estimate"]["fill_units"]

			# reject if building height units are too long
			if (len(request_data["building_height_units"]) > 10):
				return Response("Error: The building height exceed the 10 character limit", status=status.HTTP_400_BAD_REQUEST)

			# reject if bottle units are too long
			if (len(request_data["resource_estimate"]["bottle_units"]) > 70):
				return Response("Error: The bottle units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

			# reject if cement units are too long
			if (len(request_data["resource_estimate"]["cement_units"]) > 20):
				return Response("Error: The cement units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

			# reject if fill units are too long
			if (len(request_data["resource_estimate"]["fill_units"]) > 20):
				return Response("Error: The fill units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

			# reject if title is too long
			if (len(request_data["title"]) > 40):
				return Response("Error: The title exceeds the 40 character limit", status=status.HTTP_400_BAD_REQUEST)
		except KeyError:
			return Response("Missing a piece of data", status=status.HTTP_400_BAD_REQUEST)
		#----------------------------------------------------------------------------------


		#----------------------------------------------------------------------------------
		# reject if one of the estimations is not valid
		try:

			bottle_estimate = int(request_data["resource_estimate"]["bottles"]["total"])
			cement_estimate = float(request_data["resource_estimate"]["cement"]["total"])
			fill_estimate = float(request_data["resource_estimate"]["fill"]["total"])

		except KeyError:
			return Response("Missing a piece of data", status=status.HTTP_400_BAD_REQUEST)
		except ValueError:
			return Response("Error: One of the estimations is not valid. Bottles should be ints, fill and cement should be floats", status=status.HTTP_400_BAD_REQUEST)
		#----------------------------------------------------------------------------------

		#----------------------------------------------------------------------------------
		# Check that the visibility settings are valid, store visibility settings
		visible_link = request_data["visible_link"]
		visible_members = request_data["visible_members"]
		visible_public = request_data["visible_public"]


		if not(visible_link == True or visible_link == False):
			return Response("Problem related to viewable by link settings", status=status.HTTP_400_BAD_REQUEST)
		if not(visible_link == True or visible_link == False):
			return Response("Problem related to viewable by members settings", status=status.HTTP_400_BAD_REQUEST)


		if not(visible_link == True or visible_link == False):
			return Response("Problem related to viewable by public settings", status=status.HTTP_400_BAD_REQUEST)
		#----------------------------------------------------------------------------------
		# reject if one of the coordinates is not valid
		#return Response(request_data["walls"]["1"]["0"], status=status.HTTP_400_BAD_REQUEST)
		try:

			for i in range(len(request_data["walls"])):
				longitude = float(request_data["walls"][str(i)]["0"][0])
				latitude = float(request_data["walls"][str(i)]["0"][1])
				coordinate = Coordinates.objects.create(longitude=longitude, latitude=latitude)
				coordinate_array.append(coordinate)
		except KeyError:
			return Response("Missing a piece of data", status=status.HTTP_400_BAD_REQUEST)
		except ValueError:
			# delete the coordinates we have already created in our database
			for coordinate in coordinate_array:
				coordinate.delete()
			return Response("Error: The coordinates for the walls are not floating point numbers.", status=status.HTTP_400_BAD_REQUEST)
		#----------------------------------------------------------------------------------

		#----------------------------------------------------------------------------------
		# Create building and send response with url pointing to building, otherwise report error
		try:
			building = Bottle_Building.objects.create(title=title, building_height=request_data["building_height"],
                building_height_units=request_data["building_height_units"], created_by=request.user,
				bottle_units=bottle_estimate_units, cement_units=cement_estimate_units, fill_units=fill_estimate_units,
				bottle_estimate=bottle_estimate, cement_estimate=cement_estimate, fill_estimate=fill_estimate,
				visible_to_public=visible_public, visible_to_members=visible_members, visible_to_those_with_link=visible_link)
			for coordinate in coordinate_array:
				coordinate.bottle_building = building
				coordinate.save()
			url_to_design = "/view_bottle_building/building_id=" + str(building.pk)
			# Return url of building that was created.
			return Response(url_to_design, status=status.HTTP_201_CREATED)
		except Exception as exc:
			# Return Error
			return Response(str(exc), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	return Response("Please log in", status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def post_building_privacy_changes(request):
	# ensure that the user is authenticated and active
	if request.user.is_authenticated and request.user.is_active:

		# get data string
		data_string = str(request.data["data_string"])

		# construct array from data string
		request_data = json.loads(data_string)
		#return Response(data_string)
		# ensure that a building pk is included in the data
		# and that the user is the owner of the building design
		# and that the necessary privacy info is in the data
		if (request_data["building_pk"] and request_data["is_visible_to_public"] and request_data["is_visible_to_members"] and request_data["is_visible_to_link"]):
			try:

				#convert building pk to int
				building_pk = int(request_data["building_pk"])


				# try to get building
				building = Bottle_Building.objects.get(pk=building_pk)

				# if user is building owner
				if request.user.pk == building.created_by.pk:

					# cast visibility preferences to pythonic booleans
					visible_to_public = True if request_data["is_visible_to_public"] == "true" else False
					visible_to_members = True if request_data["is_visible_to_members"] == "true" else False
					visible_to_link = True if request_data["is_visible_to_link"] == "true" else False

					# set visibility preferences
					building.visible_to_public = visible_to_public
					building.visible_to_members = visible_to_members
					building.visible_to_those_with_link = visible_to_link

					building.save()

					return Response("Privacy changes have been applied.", status=status.HTTP_202_ACCEPTED)
				return Response("You are not the owner of the building design", status=status.HTTP_401_UNAUTHORIZED)

			# building does not exist
			except Bottle_Building.DoesNotExist:
				return Response("Building does not exist", status=status.HTTP_400_BAD_REQUEST)
			# error with regards to data types
			except ValueError:
				return Response("Invalid Data", status=status.HTTP_400_BAD_REQUEST)
			# general error
			except Exception as exc:
				return Response(str(exc), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ===============================================================================
# ===============================================================================
