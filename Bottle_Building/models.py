from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User


class Coordinates(models.Model):
    longitude = models.FloatField()
    latitude = models.FloatField()

'''class Bottle_Wall(models.Model):
    begin = models.ForeignKey(Coordinates, on_delete=models.CASCADE, null=True)
    end = models.ForeignKey(Coordinates, on_delete=models.CASCADE, null=True)
    length = models.FloatField()
    height = models.FloatField()

    # units
    length_units = models.CharField(max_length=20)
    height_units = models.CharField(max_length=20)
    bottle_units = models.CharField(max_length=70)
    cement_units = models.CharField(max_length=20)
    fill_units = models.CharField(max_length=20)

    # estimates
    bottle_estimate = models.IntegerField()
    cement_estimate = models.FloatField()
    fill_estimate = models.FloatField()'''


class Bottle_Building(models.Model):
    title = models.CharField(max_length=40)

    # created by user, created on datetime
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_on = models.DateTimeField(auto_now_add=True)

    # bottle wall coordinates
    coordinates = models.ManyToManyField(Coordinates, related_name="coordinates+")

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
