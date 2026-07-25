from django.db import models


class Event(models.Model):
    class Meta:
        ordering = ["starts", "id"]

    name = models.CharField(max_length=50)
    starts = models.DateTimeField()
    ends = models.DateTimeField()

    def __str__(self) -> str:
        return self.name


class Team(models.Model):
    class Meta:
        ordering = ["event", "name", "id"]

    name = models.CharField(max_length=50)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="teams")
    # Membership lives on Profile.teams; a Team's members are reachable via the
    # reverse accessor `team.profiles`.

    def __str__(self) -> str:
        return f"{self.name} ({self.event.name})"
