from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns


from . import views

urlpatterns = [
    path("projects/", views.ProjectList.as_view(), name="project-list"),
    path("projects/<int:pk>/", views.ProjectDetail.as_view(), name="project-detail"),
    path("projects/<int:proj>/todos/", views.TodoList.as_view(), name="todo-list"),
    path(
        "projects/<int:proj>/todos/<int:pk>/",
        views.TodoDetail.as_view(),
        name="todo-detail",
    ),
    path("invites/", views.InviteList.as_view(), name="invite-list"),
    path("users/", views.UserList.as_view(), name="user-list"),
    path("users/<int:pk>/", views.UserDetail.as_view(), name="user-detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)