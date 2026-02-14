from django.contrib.auth.models import User
from django.db import models


class Event(models.Model):
    name = models.CharField(max_length=50)
    starts = models.DateTimeField()
    ends = models.DateTimeField()


class Team(models.Model):
    name = models.CharField(max_length=50)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    users = models.ManyToManyField(User)
