from django.shortcuts import render
from rest_framework import viewsets
from .serializers import QuestionSerializer
from .models import question

from rest_framework.views import APIView


def home(request):
    return render(request, 'frontend/home.html')

def questions(request):
    return render(request, 'frontend/questions.html')

def answers(request):
    return render(request, 'frontend/answers.html')

class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        return question.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # obj =question.objects.get(user=self.request.user)
        serializer.save(user=self.request.user)
