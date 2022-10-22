from django.contrib       import admin
from django.urls          import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('user.urls')),
    path('board/', include('board.urls')),
    path('review/', include('review.urls')),
]