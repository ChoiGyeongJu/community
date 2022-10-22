from django.urls     import path
from .views import *

urlpatterns = [
    path('list/<int:id>', ReviewList.as_view()),
    path('upload', CreateReview.as_view()),
    path('delete/<int:id>', DeleteReview.as_view()),
]