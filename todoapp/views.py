from django.contrib.auth.models import User
from django.db.models import Q
from django.db.models.query_utils import FilteredRelation
from rest_framework import generics, permissions

from todoapp.models import Invite, Project, Todo
from todoapp.permissions import IsMemberOrOwner, IsOwnerOrReadOnly
from todoapp.serializers import (
    InviteSerializer,
    ProjectSerializer,
    TodoSerializer,
    UserSerializer,
)


class ProjectList(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsMemberOrOwner,
    ]

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(Q(owner=user) | Q(members__pk=user.pk)).distinct()

    # Set owner when a new project is saved
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        return Project.objects.filter(Q(owner=user) | Q(members__pk=user.pk)).distinct()


class TodoList(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self):
        user = self.request.user
        proj_pk = self.kwargs["proj"]
        return Todo.objects.filter(project__pk=proj_pk).distinct()

    # Set owner and project when a new todo is saved
    def perform_create(self, serializer):
        user = self.request.user
        proj_pk = self.kwargs["proj"]
        project = Project.objects.get(pk=proj_pk)
        serializer.save(owner=user, project=project)


class TodoDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        proj_pk = self.kwargs["proj"]
        return Todo.objects.filter(project__pk=proj_pk).distinct()


class InviteList(generics.ListCreateAPIView):
    queryset = Invite.objects.all()
    serializer_class = InviteSerializer


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAdminUser]


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
