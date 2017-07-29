from .models import *
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.cache import never_cache
from rest_framework.decorators import api_view



def home(request):
	if request.user.is_authenticated and request.user.is_active:
		return render(request, 'profile.html')
	return render(request, 'about.html')

def about(request):
	return render(request, "about.html")


# ===============================================================================
# Login/Logout
# ===============================================================================
def login_page(request):
	if request.user.is_authenticated and request.user.is_active:
		return render(request, 'profile.html')
	return render(request, 'login_page.html')

@api_view(['POST'])
def login(request):
    username = request.data["username"]
    password = request.data["password"]

    user = authenticate(username=username, password=password)

    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponse("Success")

    return HttpResponse("Failure")

def logout_page(request):
	logout(request)
	return render(request, "logout_successful.html")
# ===============================================================================
# ===============================================================================




# ===============================================================================
# Create Account, Create Account Page, Forgot Password, View Profile
# ===============================================================================
def create_account_page(request):
	if request.user.is_authenticated and request.user.is_active:
		return render(request, "profile.html")
	return render(request, "create_account.html")

@api_view(['POST'])
def create_account(request):

	# if username exists
		# return HttpResponse("Username is taken")
	# elif username is invalid
		# return HttpResponse("Invalid username")
	# elif email has an account
		# return HttpResponse("This e-mail already has an account.")
	# elif email is invalid
		# return HttpResponse("This is an invalid e-mail address")

    passHash = make_password(request.data['password'])
    user = User.objects.create(username=request.data['username'], email=request.data['email'], password=passHash)
    user.save()

    return HttpResponse("Account Created Successfully")

# HANDLE FORGOTTEN PASSWORD


def view_profile(request):
	if request.user.is_authenticated and request.user.is_active:
		return render(request, "profile.html")
	return render(request, "login_page.html")
# ===============================================================================
# ===============================================================================



# ===============================================================================
# Get Bottle Buildings, View Bottle Building, Design Bottle Building
# ===============================================================================

@api_view(['GET'])
def get_bottle_buildings(request):
	if request.method == "GET" and request.user.is_authenticated and request.user.is_active:
		# retrieve from db
		return HttpResponse("Insert JSON response")

def view_bottle_building(request, building_id):

	if request.method == "GET" and request.user.is_authenticated and request.user.is_active: # and the building exists in their building list
		return render("view_bottle_building.html", {"building": {}})
	return render(request, "404.html")

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



