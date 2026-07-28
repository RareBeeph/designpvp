from django.contrib import admin

from .models import Event, Team


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    fields = ["name", "starts", "ends"]


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    fields = ["name", "event"]
