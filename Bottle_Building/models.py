from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User

class Bottle_Building(models.Model):
    # created by user
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    # bottle walls
    walls = models.ManyToManyField(Bottle_Wall, related_name="bottle_walls+")

    # foundation
    foundation = models.ForeignKey(Foundation, on_delete=models.CASCADE, null=True)


class Bottle(models.Model):
    # height & units
    # diameter & units
    # volume & units
    # fill mass & units
    # fill material & density

    pass

class Bottle_Wall(models.Model):

    # point a


    # point b


    # length & units


    # 

    # average bottle


    # number of bottles


    # total mass of fill & units


    # total mass of cement & units


    pass


class Foundation(models.Model):
    # area w/ units
    # depth w/ units
    # cement mass w/ units

    pass