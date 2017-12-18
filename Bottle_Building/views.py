from .models import *
from django.shortcuts import render
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




@never_cache
@ensure_csrf_cookie
def home(request):
	if request.user.is_authenticated and request.user.is_active:

		buildings_db = Bottle_Building.objects.filter(created_by=request.user).order_by("created_on")

		return render(request, 'profile.html', {"buildings": buildings_db, "size": len(buildings_db)})
	return render(request, 'about.html')

def about(request):
	return render(request, "about.html")


# ===============================================================================
# Login/Logout
# ===============================================================================
@never_cache
@ensure_csrf_cookie
def login_page(request):
	if request.user.is_authenticated and request.user.is_active:
		buildings_db = Bottle_Building.objects.filter(created_by=request.user).order_by("created_on")

		return render(request, 'profile.html', {"buildings": buildings_db, "size": len(buildings_db)})
	return render(request, 'login_page.html')

@api_view(['POST'])
@permission_classes((AllowAny, ))
def login(request):
    username = request.data["username"]
    password = request.data["password"]

    user = authenticate(username=username, password=password)

    if user is not None:
        if user.is_active:
            auth_login(request, user)
            return Response("Logged in Successfully", status=status.HTTP_200_OK)

    return Response("Login Failed", status=status.HTTP_400_BAD_REQUEST)

def logout_page(request):
	logout(request)
	return render(request, "logout_successful.html")


@never_cache
@ensure_csrf_cookie
def forgot_credentials(request):
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
		buildings_db = Bottle_Building.objects.filter(created_by=request.user).order_by("created_on")

		return render(request, "profile.html", {"buildings": buildings_db, "size": len(buildings_db)})
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

		buildings_db = Bottle_Building.objects.filter(created_by=request.user).order_by("created_on")

		return render(request, "profile.html", {"buildings": buildings_db, "size": len(buildings_db)})

	return render(request, "login_page.html")
# ===============================================================================
# ===============================================================================



# ===============================================================================
# Get Bottle Buildings, View Bottle Building, Design Bottle Building
# ===============================================================================
# ALLOW FOR DELETING BOTTLE BUILDINGS

@api_view(['GET'])
def get_bottle_buildings(request):
	if request.method == "GET" and request.user.is_authenticated and request.user.is_active:
		# retrieve from db
		return HttpResponse("Insert JSON response")



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


		'''building_info = {}

		building_info["title"] = building.title
		building_info["pk"] = building.pk

		building_info["created_by"] = building.created_by
		building_info["created_on"] = building.created_on

		building_info["bottle_estimate"] = "{:,}".format(building.bottle_estimate)
		building_info["bottle_units"] = building.bottle_units

		building_info["cement_estimate"] = "{:,}".format(building.cement_estimate)
		building_info["cement_units"] = building.cement_units

		building_info["fill_estimate"] = "{:,}".format(building.fill_estimate)
		building_info["fill_units"] = building.fill_units


		#coordinate_array = {}
		coords = building.coordinates.all()
		#for i in range(len(coords)):
		#	coordinate_array.append({"longitude": coords[i].longitude, "latitude": coords[i].latitude})
		#	i += 1

		building_info["coordinates"] = coords'''

		link = request.build_absolute_uri("/view_bottle_building/building_id=" + str(building.pk))

		return render(request, "view_bottle_building.html", {"building": building, "link": link})
	except Exception as exc:
		return render(request, "error.html", {"exception": str(exc)})


@never_cache
@ensure_csrf_cookie
def design_bottle_building(request):
	return render(request, "design_bottle_building.html", {"use_imperial_system": True})



@api_view(['POST'])
def delete_bottle_building_design(request, building_id):

	try:
		return render(request, "404.html")
		building = Bottle_Building.objects.get(pk=building_id)
		if request.user.is_authenticated and request.user.is_active and (request.user is building.created_by):
			building.delete()
			return Response("Building deleted", status=status.HTTP_200_OK)
		return Response("Could not delete building because you are unauthorized", status=status.HTTP_401_UNAUTHORIZED)
	except Exception as exc:
		return Response("Error deleting bottle building.  Make sure the proper id was provided.", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def post_bottle_building_design(request):

	if request.user.is_authenticated and request.user.is_active:

		coordinate_array = list()

		bottle_estimate = None
		cement_estimate = None
		fill_estimate = None

		bottle_estimate_units = None
		cement_estimate_units = None
		fill_estimate_units = None

		walls = list()

		data_string = request.data["data_string"]#["walls"]
		request_data = json.loads(data_string)


		#----------------------------------------------------------------------------------

		# get units of resource estimation
		bottle_estimate_units = request_data["resource_estimate"]["bottle_units"]
		cement_estimate_units = request_data["resource_estimate"]["cement_units"]
		fill_estimate_units = request_data["resource_estimate"]["fill_units"]

		# reject if bottle units are too long
		if (len(request_data["resource_estimate"]["bottle_units"]) > 70):
			return Response("Error: The bottle units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

		# reject if cement units are too long
		if (len(request_data["resource_estimate"]["cement_units"]) > 20):
			return Response("Error: The cement units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

		# reject if fill units are too long
		if (len(request_data["resource_estimate"]["fill_units"]) > 20):
			return Response("Error: The fill units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

		#----------------------------------------------------------------------------------


		#----------------------------------------------------------------------------------
		# reject if one of the estimations is not valid
		try:
			bottle_estimate = int(request_data["resource_estimate"]["bottles"]["total"])
			cement_estimate = float(request_data["resource_estimate"]["cement"]["total"])
			fill_estimate = float(request_data["resource_estimate"]["fill"]["total"])

		except ValueError:
			return Response("Error: One of the estimations is not valid. Bottles should be ints, fill and cement should be floats", status=status.HTTP_400_BAD_REQUEST)
		#----------------------------------------------------------------------------------


		#----------------------------------------------------------------------------------
		# reject if one of the coordinates is not valid
		#return Response(request_data["walls"]["1"]["0"], status=status.HTTP_400_BAD_REQUEST)
		try:

			for i in range(len(request_data["walls"])):
				longitude = float(request_data["walls"][str(i)]["0"][0])
				latitude = float(request_data["walls"][str(i)]["0"][1])
				coordinate = Coordinates.objects.create(longitude=longitude, latitude=latitude)
				coordinate_array.append(coordinate)
		except ValueError:

			# delete the coordinates we have already created in our database
			for coordinate in coordinate_array:
				coordinate.delete()

			return Response("Error: The coordinates for the walls are not floating point numbers.", status=status.HTTP_400_BAD_REQUEST)
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
		# Create building and send response with url pointing to building, otherwise report error
		try:
			building = Bottle_Building.objects.create(title="title", created_by=request.user,
				bottle_units=bottle_estimate_units, cement_units=cement_estimate_units, fill_units=fill_estimate_units,
				bottle_estimate=bottle_estimate, cement_estimate=cement_estimate, fill_estimate=fill_estimate,
				visible_to_public=visible_public, visible_to_members=visible_members, visible_to_those_with_link=visible_link)

			for coordinate in coordinate_array:
				building.coordinates.add(coordinate)

			url_to_design = "/view_bottle_building/building_id=" + str(building.pk)
			# Return url of building that was created.
			return Response(url_to_design, status=status.HTTP_201_CREATED)
		except Exception as exc:
			# Return Error
			return Response(str(exc), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	return Response("Please log in", status=status.HTTP_401_UNAUTHORIZED)


# ===============================================================================
# ===============================================================================



