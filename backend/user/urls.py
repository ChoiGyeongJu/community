from django.urls     import path
from .views import *

urlpatterns = [
    path('login/google', GoogleLoginView.as_view()),
    # path('login/kakao', KakaoLoginView.as_view())
]