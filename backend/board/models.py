from email.policy import default
from django.db   import models
from core.models import TimeStampedModel
from user.models import User

class Category(models.Model):  # 게시판
    name     = models.CharField(max_length=100)
    is_valid = models.BooleanField(default=True)

    class Meta:
        db_table = 'categories'


class Board(models.Model):  # 게시글
    title      = models.CharField(max_length=1000)
    user       = models.ForeignKey(User, on_delete=models.CASCADE)
    content    = models.CharField(max_length=5000)
    category   = models.ForeignKey(Category, on_delete=models.CASCADE)
    views      = models.IntegerField(default=0)
    created_at = models.CharField(null=True, blank=True, max_length=100)

    class Meta:
        db_table = 'boards'


class Review(models.Model):
    user          = models.ForeignKey(User, on_delete=models.CASCADE)
    board         = models.ForeignKey(Board, on_delete=models.CASCADE)
    content       = models.CharField(max_length=500)
    parent_review = models.ForeignKey('self', on_delete=models.CASCADE, related_name='thread_review', null=True, blank=True)
    created_at    = models.CharField(null=True, blank=True, max_length=100)

    class Meta:
        db_table = 'reviews'