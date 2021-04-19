from rest_framework import serializers
from .models import question

class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = question
        fields = ["questionId","answer","user_id"]

    def create(self, validated_data):
        answer, created = question.objects.update_or_create(
            questionId=validated_data.get('questionId'),user=validated_data.get('user'),
            defaults={"questionId":validated_data.get('questionId'),'answer': validated_data.get('answer')})
        return answer