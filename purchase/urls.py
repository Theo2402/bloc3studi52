from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseViewSet
from purchase.views import PurchaseViewSet
from user.views import UpdateUserAPIView

router = DefaultRouter()
router.register(r'purchase', PurchaseViewSet, basename='purchase')

urlpatterns = [
    path('', include(router.urls)),
    path('api/update-user/', UpdateUserAPIView.as_view(), name='update-user'),
]
