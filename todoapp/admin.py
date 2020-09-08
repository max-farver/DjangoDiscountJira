from django.contrib import admin
from .models import Todo, Project, Invite

# Register your models here.
admin.site.register(Todo)
admin.site.register(Project)
admin.site.register(Invite)