from django.test import TestCase

# Create your tests here.

from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from offer.models import Offer
from purchase.models import Purchase

User = get_user_model()

class PurchaseViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass', email='testuser@example.com')
        self.staff_user = User.objects.create_user(username='staffuser', password='testpass', email='staffuser@example.com', is_staff=True)
        self.offer = Offer.objects.create(title='Test Offer', description='Offer description', price=100.0)
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        self.client.force_authenticate(user=None)
        Purchase.objects.all().delete()
        Offer.objects.all().delete()
        User.objects.all().delete()

    def test_create_purchase(self):
        data = [{'id': self.offer.id}]
        response = self.client.post(reverse('purchase-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Purchase.objects.count(), 1)
        purchase = Purchase.objects.get()
        self.assertEqual(purchase.user, self.user)
        self.assertEqual(purchase.offer, self.offer)

    def test_list_purchases(self):
        Purchase.objects.create(user=self.user, offer=self.offer)
        response = self.client.get(reverse('purchase-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_purchases_as_staff(self):
        Purchase.objects.create(user=self.user, offer=self.offer)
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(reverse('purchase-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_unauthenticated_user_cannot_create_purchase(self):
        self.client.force_authenticate(user=None)
        data = [{'id': self.offer.id}]
        response = self.client.post(reverse('purchase-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_user_cannot_list_purchases(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('purchase-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
