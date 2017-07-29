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

    url(r'^login_page/', views.login_page, name="login_page"),
    url(r'^login/', views.login, name="login"),
    url(r'^logout/', views.logout_page, name="logout"),

    url(r'^create_account/', views.create_account_page, name="create_account"),
    url(r'^register/', views.create_account, name="register"),
    url(r'^view_profile/', views.view_profile, name="profile"),

    url(r'^get_bottle_buildings/', views.get_bottle_buildings, name="get_bottle_buildings"),
    url(r'^view_bottle_building/building_id=(?P<building_id>\d+)/$', views.view_bottle_building, name="view_bottle_building"),
    url(r'^design_bottle_building/', views.design_bottle_building, name="design_bottle_building"),
    url(r'^post_bottle_building_design/', views.post_bottle_building_design, name="post_bottle_building_design"),

    url(r'^admin/', admin.site.urls),
]
