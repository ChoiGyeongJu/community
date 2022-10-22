from django.urls     import path
from .views import *

urlpatterns = [
    path('login/google', GoogleLoginView.as_view()),
    path('login/kakao', KakaoLoginView.as_view()),
    path('login/naver', NaverLoginView.as_view()),
    path('delete/<int:id>', DeleteUser.as_view()),
    path('user', UserInfoView.as_view()),
]