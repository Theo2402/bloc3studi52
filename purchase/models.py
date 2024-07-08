from django.db import models

# Create your models here.
from django.db import models
from django.utils.crypto import get_random_string
from user.models import UserProfile
from offer.models import Offer

def generate_safe_key():
    return get_random_string(length=32)

class Purchase(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)
    safe_key = models.CharField(max_length=200, default=generate_safe_key)

    def save(self, *args, **kwargs):
        if not self.safe_key:
            self.safe_key = get_random_string(length=32)
        super().save(*args, **kwargs)
