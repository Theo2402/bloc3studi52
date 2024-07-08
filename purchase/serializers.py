from rest_framework import serializers
from .models import Purchase
from user.serializers import UserProfileSerializer
from offer.serializers import OfferSerializer

class PurchaseSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    offer = OfferSerializer(read_only=True)
    combined_key = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Purchase
        fields = ['id', 'user', 'offer', 'purchase_date', 'safe_key', 'combined_key', 'username']
        read_only_fields = ['safe_key']

    def get_combined_key(self, obj):
        return f"{obj.user.uuid}_{obj.safe_key}"





