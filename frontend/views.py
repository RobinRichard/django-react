from django.shortcuts import render
from rest_framework import viewsets
from .serializers import QuestionSerializer
from .models import question


def home(request):
    return render(request, 'frontend/home.html')

def questions(request):
    return render(request, 'frontend/questions.html')

def answers(request):
    return render(request, 'frontend/answers.html')

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = question.objects.all()
    serializer_class = QuestionSerializer