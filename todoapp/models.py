from django.db import models
from django.utils import timezone
from datetime import timedelta
import uuid

STAGE_CHOICES = [
    ("Backlog", "Backlog"),
    ("UpNext", "UpNext"),
    ("InProgress", "InProgress"),
    ("NeedsReview", "NeedsReview"),
    ("InReview", "InReview"),
    ("Complete", "Complete"),
]

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=150, blank=True, default="")
    owner = models.ForeignKey(
        "auth.User", related_name="projects", on_delete=models.CASCADE
    )
    members = models.ManyToManyField("auth.User")


class Todo(models.Model):
    name = models.CharField(max_length=150, blank=True, default="")
    description = models.CharField(max_length=300, blank=True, default="")
    complete = models.BooleanField(default=False)
    stage = models.CharField(
        choices=STAGE_CHOICES,
        default="Backlog",
        max_length=100,
    )
    owner = models.ForeignKey(
        "auth.User", related_name="todos", on_delete=models.CASCADE
    )
    project = models.ForeignKey(Project, related_name="todos", on_delete=models.CASCADE)


class Invite(models.Model):
    id = models.CharField(max_length=10, primary_key=True, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created = models.DateTimeField(editable=False, auto_now_add=True)
    expire_time = models.IntegerField(blank=True, default=1)
    valid_until = models.DateTimeField(editable=False, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:10].upper()
            self.valid_until = timezone.now() + timedelta(self.expire_time)

        return super(Invite, self).save(*args, **kwargs)
