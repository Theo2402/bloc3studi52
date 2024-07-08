from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from .views import MyTokenObtainPairView,RegisterUserAPIView
from django.http import HttpResponse 

router = DefaultRouter()
router.register(r'', UserViewSet)  

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterUserAPIView.as_view(), name='register'),  
   
]

