"""Bottle_Builder URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from Bottle_Building import views, views_account, views_forgot_credentials, views_misc, views_pertaining_to_buildings

'''
    This is a list of the various url routes the server listens for and handles.
    It is in the following format: url('{URL}', {PATH_TO_HANDLER_FUNCTION}, (optional) {ROUTE_NAME})
'''

urlpatterns = [
    url(r'^$', views_misc.home, name='home'),
    url(r'^about/', views_misc.about, name="about"),
    url(r'^submit_feedback/', views_misc.submit_feedback, name="submit_feedback"),
    url(r'^admin/', admin.site.urls),

    url(r'^forgot_credentials_page/', views_forgot_credentials.forgot_credentials_page, name="forgot_credentials"),
    url(r'^forgot_username/', views_forgot_credentials.forgot_username, name="forgot_username"),
    url(r'^request_password_reset_link/', views_forgot_credentials.request_password_reset_link, name="request_password_reset_link"),
    url(r'^reset_password_page/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views_forgot_credentials.reset_password_page, name="reset_password_page"),
    url(r'^reset_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views_forgot_credentials.reset_password, name="reset_password"),
    url(r'^request_account_activation_link/', views_forgot_credentials.request_account_activation_link, name="request_account_activation_link"),

    url(r'^change_password_page/', views_account.change_password_page, name="change_password_page"),
    url(r'^change_password/', views_account.change_password, name="change_password"),
    url(r'^login_page/', views_account.login_page, name="login_page"),
    url(r'^login/', views_account.login, name="login"),
    url(r'^logout/', views_account.logout_page, name="logout"),
    url(r'^create_account/', views_account.create_account_page, name="create_account"),
    url(r'^register/', views_account.register, name="register"),
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views_account.activate_account, name="activate_account"),
    url(r'^view_profile/', views_account.view_profile, name="profile"),

    url(r'^delete_bottle_building/building_id=(?P<building_id>\d+)/$', views_pertaining_to_buildings.delete_bottle_building_design, name="delete_bottle_building"),
    url(r'^view_bottle_building/building_id=(?P<building_id>\d+)/$', views_pertaining_to_buildings.view_bottle_building, name="view_bottle_building"),
    url(r'^design_bottle_building/', views_pertaining_to_buildings.design_bottle_building, name="design_bottle_building"),
    url(r'^post_bottle_building_design/', views_pertaining_to_buildings.post_bottle_building_design, name="post_bottle_building_design"),
    url(r'^post_building_privacy_changes/', views_pertaining_to_buildings.post_building_privacy_changes, name="post_building_privacy_changes"),

]
