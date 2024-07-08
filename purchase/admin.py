from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Purchase

class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('user', 'offer', 'purchase_date', 'safe_key')
    search_fields = ('user__username', 'user__name', 'offer__title')
    list_filter = ('purchase_date',)
    raw_id_fields = ('user', 'offer')  
    ordering = ('-purchase_date',)

admin.site.register(Purchase, PurchaseAdmin)
