from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from offer.models import Offer
from purchase.models import Purchase

User = get_user_model()

class PurchaseViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass', email='testuser@example.com', name='Test User')
        self.client.force_authenticate(user=self.user)
        self.offer = Offer.objects.create(title='Test Offer', description='Offer description', price=100.0)

    def test_create_purchase(self):
        data = [{'id': self.offer.pk}]
        response = self.client.post('/api/purchase/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_purchases(self):
        response = self.client.get('/api/purchase/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_purchases_as_staff(self):
        self.user.is_staff = True
        self.user.save()
        response = self.client.get('/api/purchase/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_create_purchase(self):
        self.client.force_authenticate(user=None)
        data = [{'id': self.offer.pk}]
        response = self.client.post('/api/purchase/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_user_cannot_list_purchases(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/purchase/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
