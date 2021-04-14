from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class question(models.Model):
    questionId = models.CharField(max_length=50)
    answer = models.TextField()
    user =  models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self):
        return self.questionId

