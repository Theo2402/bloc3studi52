from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Offer
from .serializers import OfferSerializer
from .permissions import IsAuthenticatedOrReadOnly


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]



