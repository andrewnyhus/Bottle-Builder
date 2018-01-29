from .views import *

'''
    Serves the forgot credentials page.
    This contains: forgot username, forgot password and request account activation link.
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def forgot_credentials_page(request):
    return render(request, 'forgot_credentials.html')
#===============================================================================


'''
    Serves the reset password page if the token is valid.
    Otherwise, provides an appropriate message.
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def reset_password_page(request, uidb64, token):
    try:
        # help from https://stackoverflow.com/questions/25292052/send-email-confirmation-after-registration-django
        if uidb64 is not None and token is not None:
            uid = urlsafe_base64_decode(str(uidb64))
            user = User.objects.get(pk=uid)

            # if token is valid, render the page
            if default_token_generator.check_token(user, token):
                return render(request, "reset_password.html", {"username": user.username, "uid":uidb64, "token":token})

            return render(request, "message.html", {"title":"Token Invalid/Expired", "heading":"Token Invalid/Expired", "message":"This token has expired or is invalid. Please request a new link at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/")})
    except User.DoesNotExist:
        return render(request, "message.html", {"title":"User is Invalid/Bad Link", "heading":"User is Invalid/Bad Link", "message":"The user is invalid or the link is bad. Please request a new link at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/")})
    except Exception as exc:
        return render(request, "error.html", {"message": "Sorry! We had a problem loading your reset password link. Please try again or request another."})
#===============================================================================


'''
    Handles the reset password requests.
    If the request and token are valid, it updates the password.
    Otherwise, an appropriate response is returned.
'''
#===============================================================================
@api_view(["POST"])
@permission_classes((AllowAny, ))
def reset_password(request, uidb64, token):
    try:

        # help from https://stackoverflow.com/questions/25292052/send-email-confirmation-after-registration-django
        if uidb64 is not None and token is not None:
            uid = urlsafe_base64_decode(str(uidb64))
            user = User.objects.get(pk=uid)

            new_password = request.data["password"]

            # if token is valid, render the page
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response("Your new password has been saved.", status=status.HTTP_202_ACCEPTED)

            return Response("Your token has expired, please request a new link at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/"), status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response("The user is invalid or the link is bad. Please request a new link at our forgot credentials page: "+request.build_absolute_uri("/forgot_credentials_page/"), status=status.HTTP_400_BAD_REQUEST)
    except Exception as exc:
        return Response("There was an issue setting your new password. Please try again", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#===============================================================================


'''
    Handles the forgot username requests.
    If the provided email is associated with an account, that account's
    username is sent to the provided email.
    Otherwise, an appropriate response is returned.
'''
#===============================================================================
@api_view(["POST"])
@permission_classes((AllowAny, ))
def forgot_username(request):
    try:
        email = request.data["email"]

        # determine that the email is a valid email
        location_of_at_symbol = email.find("@")

        # if not valid, respond so

        if location_of_at_symbol == -1:
            return Response("Invalid Email", status=status.HTTP_400_BAD_REQUEST)

        second_half_of_email = email[location_of_at_symbol:]

        if second_half_of_email.find(".") == -1:
            return Response("Invalid Email", status=status.HTTP_400_BAD_REQUEST)

        # email is valid
        user = User.objects.get(email=email)

        # now we email the username to the account holders email.
        body = "Your username is: " + user.username
        send_email(email,"Your Bottle Builder Username", body)

        return Response("We have successfully emailed you your username", status=status.HTTP_200_OK)
    except KeyError:
        return Response("No email was provided.", status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response("No account is associated with that email.", status=status.HTTP_400_BAD_REQUEST)
    except Exception as exc:
        return Response("Problem handling forgot username email request. Please try a few more times", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#===============================================================================


'''
    Handles the request password reset link requests.
    If the provided email is associated with an account, a password reset link
    is generated and sent to the provided email.
    Otherwise, an appropriate response is returned.
'''
#===============================================================================
@api_view(["POST"])
@permission_classes((AllowAny, ))
def request_password_reset_link(request):
    try:
        email = request.data["email"]

        # determine that the email is a valid email
        location_of_at_symbol = email.find("@")

        # if not valid, respond so

        if location_of_at_symbol == -1:
            return Response("Invalid Email", status=status.HTTP_400_BAD_REQUEST)

        second_half_of_email = email[location_of_at_symbol:]

        if second_half_of_email.find(".") == -1:
            return Response("Invalid Email", status=status.HTTP_400_BAD_REQUEST)

        # email is valid
        user = User.objects.get(email=email)


        # generate token
        token = default_token_generator.make_token(user)
        uid = str(urlsafe_base64_encode(force_bytes(user.pk)))

        # if necessary strip b''
        if (uid[:2] == "b'") and (uid[len(uid) - 1] == "'"):
            uid = uid[2:len(uid)-1]

        # construct activation url and email body
        url = request.build_absolute_uri("/reset_password_page/"+uid+"/"+str(token)+"/")

        body = '''Please go to the following link to reset your password:
                '''+url+'''
                '''

        send_email(email,"Your Bottle Builder Password Reset Link", body)
        return Response("Your password reset link has been emailed to you.", status=status.HTTP_200_OK)
    except KeyError:
        return Response("No email was provided.", status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response("No account is associated with that email.", status=status.HTTP_400_BAD_REQUEST)
    except Exception as exc:
        return Response("Problem handling password reset email request. Please try a few more times", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#===============================================================================



'''
    Handles the request account activation link requests.
    If the provided email is associated with an inactive account, an account
    activation link is generated and sent to the provided email.
    Otherwise, an appropriate response is returned.
'''
#===============================================================================
@api_view(["POST"])
@permission_classes((AllowAny, ))
def request_account_activation_link(request):
    try:
        email = request.data["email"]

        # determine that the email is a valid email
        location_of_at_symbol = email.find("@")

        # if not valid, respond so

        if location_of_at_symbol == -1:
            return Response("Invalid Email", status=status.HTTP_400_BAD_REQUEST)

        second_half_of_email = email[location_of_at_symbol:]

        if second_half_of_email.find(".") == -1:
            return Response("Invalid Email", status=status.HTTP_400_BAD_REQUEST)

        # email is valid
        user = User.objects.get(email=email)

        if user.is_active:
            return Response("This user is already active.", status=status.HTTP_400_BAD_REQUEST)

        # generate token
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

        # now we email the link to the account holders email.
        send_email(user.email,"Your Bottle Builder Account Activation Link", body)

        return Response("We have successfully emailed you your account activation link", status=status.HTTP_200_OK)
    except KeyError:
        return Response("No email was provided.", status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response("No account is associated with that email.", status=status.HTTP_400_BAD_REQUEST)
    except Exception as exc:
        return Response("Problem handling activation email request. Please try a few more times", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#===============================================================================
