from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Offer

class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'price')
    search_fields = ('title', 'description')
    list_filter = ('price',)
    ordering = ('title',)

admin.site.register(Offer, OfferAdmin)
