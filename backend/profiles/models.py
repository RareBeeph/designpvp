from django.contrib.auth.models import User
from django.db import models

from events.models import Team


class Profile(models.Model):
    # Presumably, if you delete your profile you also want to delete your account for auth, and vice versa
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    teams = models.ManyToManyField(Team)
    objects = models.Manager()  # I don't know why mypy wants me to explicitly specify this here but not in my other models
    # characters = models.ManyToManyField(Character)
    # attacks = models.ManyToManyField(Attack)
    # settings = models.ForeignKey(Settings)


# class Settings(models.Model):
#     pass
