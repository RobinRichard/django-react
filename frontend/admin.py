
from django.contrib import admin
from .models import question

class QuestionAdmin(admin.ModelAdmin):
    list_display = ("questionId","user","answer")
    list_filter = ("questionId",)
    pass

admin.site.register(question, QuestionAdmin)