from django.db import models

# Create your models here.
from django.db import models

class Offer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
