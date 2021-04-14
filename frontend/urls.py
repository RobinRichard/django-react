from django.urls import path,include
from . import views

from rest_framework import routers

router = routers.DefaultRouter()
router.register('questions', views.QuestionViewSet)


urlpatterns = [
    path('', views.home),
    path('questions', views.questions),
    path('answers', views.answers),
    path('api/', include(router.urls)),
]
