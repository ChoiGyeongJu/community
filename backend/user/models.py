from django.db   import models
from core.models import TimeStampedModel


class SocialPlatform(models.Model):
    platform = models.CharField(max_length=20, default=0)

    class Meta:
        db_table = "social_platforms"


class User(TimeStampedModel):
    nickname           = models.CharField(max_length=100, null=True)
    is_valid           = models.BooleanField(default=True, blank=True)
    social             = models.ForeignKey(SocialPlatform, on_delete=models.CASCADE, max_length=20, blank=True, default=1)
    social_login_id    = models.CharField(max_length=50, blank=True)
    refresh_token      = models.CharField(max_length=500, null=True)
    email              = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = 'users'