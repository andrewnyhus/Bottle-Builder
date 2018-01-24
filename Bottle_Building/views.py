from .models import *
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, logout
from django.contrib.auth import login as auth_login
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.cache import never_cache
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import json
import re
import smtplib
from email.mime.text import MIMEText
from .email_account import *


'''
    Helper function that returns a message that corresponds to a given key.
    This to standardize the response messages that the server gives.
'''
#===============================================================================
def get_response_message(key):
    response_messages = {}

    try:
        return response_messages[key]
    except KeyError:
        return "Error retrieving response message, key is invalid."
#===============================================================================


'''
    Helper function that sends an email with a specified:
    recipient, subject, and plaintext message body from the email account with
    the credentials that are stored in email_account.py (get_email_address() and get_password())
'''
#===============================================================================
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
#===============================================================================
