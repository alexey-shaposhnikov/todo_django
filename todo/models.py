from django.db import models
from django.contrib.auth.models import User


class TodoItem(models.Model):
    name = models.CharField(max_length=255)
    done = models.BooleanField(default=False)
    user = models.ForeignKey(User, blank=False, null=False, default=0)
