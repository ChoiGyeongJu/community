from django.urls     import path
from .views import *

urlpatterns = [
    path('categories', CategoryView.as_view()),
    path('boards/<int:id>', BoardListView.as_view()),
    path('upload', BoardUploadView.as_view()),
    path('delete/<int:id>', BoardDeleteView.as_view()),
]