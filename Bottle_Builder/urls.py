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
from Bottle_Building import views


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^about/', views.about, name="about"),
    url(r'^submit_feedback/', views.submit_feedback, name="submit_feedback"),

    url(r'^forgot_credentials_page/', views.forgot_credentials_page, name="forgot_credentials"),
    url(r'^forgot_username/', views.forgot_username, name="forgot_username"),
    url(r'^request_password_reset_link/', views.request_password_reset_link, name="request_password_reset_link"),
    url(r'^reset_password_page/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.reset_password_page, name="reset_password_page"),
    url(r'^reset_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.reset_password, name="reset_password"),
    url(r'^request_account_activation_link/', views.request_account_activation_link, name="request_account_activation_link"),


    url(r'^login_page/', views.login_page, name="login_page"),
    url(r'^login/', views.login, name="login"),
    url(r'^logout/', views.logout_page, name="logout"),
    url(r'^create_account/', views.create_account_page, name="create_account"),
    url(r'^register/', views.register, name="register"),
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.activate_account, name="activate_account"),
    url(r'^view_profile/', views.view_profile, name="profile"),

    url(r'^delete_bottle_building/building_id=(?P<building_id>\d+)/$', views.delete_bottle_building_design, name="delete_bottle_building"),
    url(r'^view_bottle_building/building_id=(?P<building_id>\d+)/$', views.view_bottle_building, name="view_bottle_building"),
    url(r'^design_bottle_building/', views.design_bottle_building, name="design_bottle_building"),
    url(r'^post_bottle_building_design/', views.post_bottle_building_design, name="post_bottle_building_design"),
    url(r'^post_building_privacy_changes/', views.post_building_privacy_changes, name="post_building_privacy_changes"),

    url(r'^admin/', admin.site.urls),
]
