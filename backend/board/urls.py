from django.urls     import path
from .views import *

urlpatterns = [
    path('categories', CategoryView.as_view()),
    path('board/<int:id>', BoardView.as_view()),
    path('board-list/<int:id>', BoardListView.as_view()),
    path('board-all', BoardByCategory.as_view()),
    path('upload', BoardUploadView.as_view()),
    path('delete/<int:id>', BoardDeleteView.as_view()),
    path('add-view/<int:id>', UpdateViews.as_view()),
]