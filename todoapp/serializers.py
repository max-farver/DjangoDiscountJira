from django.contrib.auth.models import User
from rest_framework import serializers

from todoapp.models import STAGE_CHOICES, Invite, Project, Todo


class InviteSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Invite
        fields = ["id", "project", "created", "expire_time", "valid_until"]


class TodoSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Todo
        fields = ["id", "name", "description", "complete", "stage", "owner"]


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    todos = TodoSerializer(many=True, read_only=True)
    members = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "owner", "members", "todos"]


class UserSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True)

    class Meta:
        model = User
        fields = ["id", "username", "todos", "projects"]
