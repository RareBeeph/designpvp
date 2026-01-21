from django.db import models


class Event(models.Model):
    name: models.CharField = models.CharField(max_length=50)
    starts: models.DateTimeField = models.DateTimeField()
    ends: models.DateTimeField = models.DateTimeField()


class Team(models.Model):
    name: models.CharField = models.CharField(max_length=50)
    event: models.ForeignKey = models.ForeignKey(Event, on_delete=models.CASCADE)
