from rest_framework import serializers
from .models import question

class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = question
        fields = ["questionId","answer","user_id"]