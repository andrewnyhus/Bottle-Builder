from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User



class Bottle(models.Model):
    # height & units


    # diameter & units


    # volume & units


    # fill mass & units


    # fill material & density


    pass

class Coordinates(models.Model):
    longitude = models.FloatField()
    latitude = models.FloatField()



class Bottle_Building(models.Model):
    # created by user, created on datetime
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_on = models.DateTimeField(auto_now_add=True)

    # bottle wall coordinates
    coordinates = models.ManyToManyField(Coordinates, related_name="coordinates+")

    # units
    bottle_units = models.CharField(max_length=30)
    cement_units = models.CharField(max_length=15)
    fill_units = models.CharField(max_length=15)

    # estimates
