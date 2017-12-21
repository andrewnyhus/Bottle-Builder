from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User



class Bottle_Building(models.Model):
    title = models.CharField(max_length=40)

    # created by user, created on datetime
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    created_on = models.DateTimeField(auto_now_add=True)

    # bottle wall coordinates
    #coordinates = models.ManyToManyField(Coordinates, on_delete=models.CASCADE, related_name="coordinates+")

    # units
    bottle_units = models.CharField(max_length=70)
    cement_units = models.CharField(max_length=20)
    fill_units = models.CharField(max_length=20)

    # estimates
    bottle_estimate = models.IntegerField()
    cement_estimate = models.FloatField()
    fill_estimate = models.FloatField()

    # privacy
    visible_to_public = models.BooleanField()
    visible_to_members = models.BooleanField()
    visible_to_those_with_link = models.BooleanField()


class Coordinates(models.Model):
    bottle_building = models.ForeignKey(Bottle_Building, null=True)
    longitude = models.FloatField()
    latitude = models.FloatField()
