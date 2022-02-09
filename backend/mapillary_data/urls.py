from django.urls import path
from django.views import View
from . import views
urlpatterns = [
    path("", views.react, name="react"),
    path("api/images/", views.get_image_data, name="image_data")
]