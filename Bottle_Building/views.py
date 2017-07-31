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
		return render(request, 'profile.html')
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
		return render(request, 'profile.html')
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
		return render(request, "profile.html")
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
			user.save()

			return Response("Account Created Successfully", status=status.HTTP_201_CREATED)


@never_cache
@ensure_csrf_cookie
def view_profile(request):
	if request.user.is_authenticated and request.user.is_active:
		return render(request, "profile.html")
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

	if request.method == "GET" and request.user.is_authenticated and request.user.is_active: # and the building exists in their building list
		return render("view_bottle_building.html", {"building": {}})
	return render(request, "404.html")

@never_cache
@ensure_csrf_cookie
def design_bottle_building(request):
	return render(request, "design_bottle_building.html")

@api_view(['POST'])
def post_bottle_building_design(request):
	if request.user.is_authenticated and request.user.is_active:

		# if request is valid

		# save bottle building
		return HttpResponse("Success")
	return HttpResponse("Failure")
# ===============================================================================
# ===============================================================================



