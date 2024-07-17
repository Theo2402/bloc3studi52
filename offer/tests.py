from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from offer.models import Offer

User = get_user_model()

class OfferViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass', email='testuser@example.com', name='Test User')
        self.client.force_authenticate(user=self.user)
        self.offer = Offer.objects.create(title='Test Offer', description='Offer description', price=100.0)

    def test_create_offer(self):
        data = {'title': 'New Offer', 'description': 'New Offer description', 'price': 50.0}
        response = self.client.post('/api/offer/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_offer(self):
        response = self.client.delete(f'/api/offer/{self.offer.pk}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_offer(self):
        response = self.client.get(f'/api/offer/{self.offer.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_offer(self):
        data = {'title': 'Updated Offer', 'description': 'Updated Offer description', 'price': 150.0}
        response = self.client.put(f'/api/offer/{self.offer.pk}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthorized_create_offer(self):
        self.client.force_authenticate(user=None)
        data = {'title': 'New Offer', 'description': 'New Offer description', 'price': 50.0}
        response = self.client.post('/api/offer/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_update_offer(self):
        self.client.force_authenticate(user=None)
        data = {'title': 'Updated Offer', 'description': 'Updated Offer description', 'price': 150.0}
        response = self.client.put(f'/api/offer/{self.offer.pk}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_delete_offer(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(f'/api/offer/{self.offer.pk}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

