from .views import *


'''
    Serves the change password page. This page is for those who have not forgotten
    their password, and can only be accessed if the user is authenticated and active.
    If they are not, they are told to activate their account or redirected to the login page.
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def change_password_page(request):
    if request.user.is_authenticated() and request.user.is_active:
        return render(request, "change_password.html", {"username": request.user.username})
    elif request.user.is_authenticated():
        return render(request, "message.html", {"title":"Please Activate Your Account", "heading":"Please Activate Your Account", "message":"Check your email for the activation link, or request a new one at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/")})
    else:
        return redirect(login_page)
#===============================================================================


'''
    Changes the password if the request is valid. Otherwise returns an appropriate response.
'''
#===============================================================================
@api_view(["POST"])
def change_password(request):
    if request.user.is_authenticated() and request.user.is_active:

        username = request.user.username
        current_password = request.data["current_password"]
        new_password = request.data["new_password"]

        # try authenticating with current password before setting new password
        user = authenticate(username=username, password=current_password)

        if user is not None:
            user.set_password(new_password)
            user.save()
            return Response("Your new password has been updated.", status=status.HTTP_202_ACCEPTED)
        else:
            return Response("Incorrect current password.", status=status.HTTP_400_BAD_REQUEST)
    elif request.user.is_authenticated():
        return Response("Account Inactive. Check your email for the activation link, or request a new one at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/"), status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response("You are not authenticated", status=status.HTTP_401_UNAUTHORIZED)
#===============================================================================


'''
    Serves the login page, unless the user is authenticated and active.
    In that case, it redirects to the user's profile page.
    If the user is not active but is authenticated,
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def login_page(request):
    if request.user.is_authenticated() and request.user.is_active:
        return redirect(view_profile)
    elif request.user.is_authenticated():
        return render(request, "message.html", {"title":"Please Activate Your Account", "heading":"Please Activate Your Account", "message":"Check your email for the activation link, or request a new one at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/")})

    return render(request, 'login_page.html')
#===============================================================================


'''
    Handles the login requests. Logs in user if request is valid. Returns
    appropriate response otherwise.
'''
#===============================================================================
@api_view(['POST'])
@permission_classes((AllowAny, ))
def login(request):
    try:
        username = request.data["username"]
        password = request.data["password"]

        user = authenticate(username=username, password=password)

        # is user exists and password is correct
        if user is not None:

            # if user is not active, make them active
            if(not(user.is_active)):
                return Response("Your Account is Inactive, Please Check Your Email or Visit: " + request.build_absolute_uri("/forgot_credentials_page/"), status=status.HTTP_401_UNAUTHORIZED)

            auth_login(request, user)

            return Response("Logged in Successfully", status=status.HTTP_202_ACCEPTED)
        elif User.objects.get(username=username) is not None:
            return Response("Login Failed, Password is Incorrect", status=status.HTTP_400_BAD_REQUEST)

        return Response("Login Failed, Username is Incorrect.", status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response("Login Failed, Username is Incorrect.", status=status.HTTP_400_BAD_REQUEST)
    except Exception as exc:
        return Response("Login Failed, Server Problem, Please Try Again", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#===============================================================================



'''
    Logs user out if they are authenticated, informs the user.
'''
#===============================================================================
def logout_page(request):
    logout(request)
    return render(request, "logout_successful.html")
#===============================================================================


'''
    Handles the account activation requests.
    If token and uid are valid, the account associated with that uid is activated.
    Otherwise, an appropriate message is given to the user.
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def activate_account(request, uidb64, token):
    # help from https://stackoverflow.com/questions/25292052/send-email-confirmation-after-registration-django
    if uidb64 is not None and token is not None:
        try:
            uid = urlsafe_base64_decode(str(uidb64))
            user = User.objects.get(pk=uid)
            # if user is inactive and token is valid
            if default_token_generator.check_token(user, token) and not(user.is_active):
                # set activate user, log them in and redirect to home
                user.is_active = True
                user.save()
                return render(request, "message.html", {"title": "Account Activated Successfully!", "heading":"Your Account Has Been Activated", "message":"Please login now."})
            return render(request, "message.html", {"title":"Account Activation Failed", "heading":"Account Activation Failed", "message":"This token has expired or is invalid. If you have not already activated your account, please do so at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/")})
        except User.DoesNotExist:
            return render(request, "message.html", {"title":"User is Invalid/Bad Link", "heading":"User is Invalid/Bad Link", "message":"The user is invalid or the link is bad. Please request a new link at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/")})
        except Exception as exc:
            return render(request, "error.html", {"message": "Sorry! We had a problem activating your account"})
#===============================================================================


'''
    Serves the create account page if the user is unauthenticated.
    Otherwise it either instructs the user to activate their account
    or it redirects the user to their profile page.
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def create_account_page(request):
    if request.user.is_authenticated() and request.user.is_active:
        return redirect(view_profile)
    elif request.user.is_authenticated():
        return render(request, "message.html", {"title":"Please Activate Your Account", "heading":"Please Activate Your Account", "message":"Check your email for the activation link, or request a new one at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/")})
    return render(request, "create_account.html")
#===============================================================================



'''
    Handles the register account requests. It confirms that the account is valid.
    If it is not, an appropriate message is returned.
    If it is valid, the account is created, an activation token is generated,
    and an account activation link is emailed to the user.
'''
#===============================================================================
@api_view(['POST'])
@permission_classes((AllowAny, ))
def register(request):


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

            try:

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

                token = default_token_generator.make_token(user)
                uid = str(urlsafe_base64_encode(force_bytes(user.pk)))

                # if necessary strip b''
                if (uid[:2] == "b'") and (uid[len(uid) - 1] == "'"):
                    uid = uid[2:len(uid)-1]

                # construct activation url and email body
                url = request.build_absolute_uri("/activate/"+uid+"/"+str(token)+"/")
                body = '''Please go to the following link to activate your account:
                        '''+url+'''
                        '''

                send_email(user.email,"Your Bottle Builder Account Activation Link", body)

                return Response("Account Created Successfully, Please Check Your Email For Your Temporary Account Activation Link", status=status.HTTP_201_CREATED)
            except Exception as exc:
                return Response("Error, account may have been created. Try logging in, if you are told to activate your account, either check your email for an activation link, or request a new one from our forgotten credentials page: "+ request.build_absolute_uri("/forgot_credentials_page/"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#===============================================================================


'''
    Serves the user's profile page if the user is active and authenticated.
    Otherwise, it either instructs the user to activate their account, or it
    redirects them to the login page
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def view_profile(request):

    if request.user.is_authenticated() and request.user.is_active:

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
    elif request.user.is_authenticated():
        return render(request, "message.html", {"title":"Please Activate Your Account", "heading":"Please Activate Your Account", "message":"Check your email for the activation link, or request a new one at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/")})
    else:
        return redirect(login_page)
#===============================================================================
