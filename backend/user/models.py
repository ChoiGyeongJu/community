from unicodedata import name
from django.db   import models
from core.models import TimeStampedModel

class User(TimeStampedModel):
    # account            = models.CharField(max_length=100)
    # password           = models.CharField(max_length=500)
    # name               = models.CharField(max_length=100)
    nickname           = models.CharField(max_length=100)
    is_valid           = models.BooleanField(default=True, blank=True)
    # refresh_token      = models.CharField(max_length=500, null=True)

    class Meta:
        db_table = 'users'