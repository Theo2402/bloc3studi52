from django.shortcuts import render


# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from django.utils.crypto import get_random_string
from .models import Purchase
from .serializers import PurchaseSerializer

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]


    def create(self, request, *args, **kwargs):
        try:
            offers = request.data
            user = request.user

            if not isinstance(offers, list):
                return Response({"error": "Expected a list of offers"}, status=status.HTTP_400_BAD_REQUEST)

            for offer in offers:
                if 'id' not in offer:
                    return Response({"error": "Offer ID is required"}, status=status.HTTP_400_BAD_REQUEST)

                Purchase.objects.create(
                    user=user,
                    offer_id=offer['id'],
                    safe_key=get_random_string(length=32)
                )

            return Response({"status": "Purchase successful"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Purchase.objects.all()
        return Purchase.objects.filter(user=user)
    
