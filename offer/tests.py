from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from .models import Offer
from django.contrib.auth import get_user_model 

User = get_user_model()

class OfferViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.offer_data = {
            'title': 'Test Offer',
            'description': 'This is a test offer.',
            'price': '40.5'
        }
        self.offer = Offer.objects.create(**self.offer_data)

        self.user_data = {
            'username': 'testuser',
            'password': 'testpass',
            'email': 'testuser@example.com'
        }
        self.user = User.objects.create_user(**self.user_data)
        self.client.login(username='testuser', password='testpass')

    def tearDown(self):
        self.client.logout()
        Offer.objects.all().delete()
        User.objects.all().delete()

    def test_create_offer(self):
        data = {
            'title': 'New Offer',
            'description': 'This is a new offer.',
            'price': '20.5'
        }
        response = self.client.post(reverse('offer-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Offer.objects.count(), 2)
        self.assertEqual(Offer.objects.get(id=response.data['id']).title, 'New Offer')

    def test_get_offer(self):
        response = self.client.get(reverse('offer-detail', args=[self.offer.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.offer.title)

    def test_update_offer(self):
        updated_data = {
            'title': 'Updated Offer',
            'description': 'This is an updated offer.',
            'price': '32.6'
        }
        response = self.client.put(reverse('offer-detail', args=[self.offer.id]), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Offer.objects.get(id=self.offer.id).title, 'Updated Offer')

    def test_delete_offer(self):
        response = self.client.delete(reverse('offer-detail', args=[self.offer.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Offer.objects.count(), 0)

    def test_unauthorized_create_offer(self):
        self.client.logout()
        data = {
            'title': 'New Offer',
            'description': 'This is a new offer.',
            'price': '66.9'
        }
        response = self.client.post(reverse('offer-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_update_offer(self):
        self.client.logout()
        updated_data = {
            'title': 'Updated Offer',
            'description': 'This is an updated offer.',
            'price': '10.2'
        }
        response = self.client.put(reverse('offer-detail', args=[self.offer.id]), updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_delete_offer(self):
        self.client.logout()
        response = self.client.delete(reverse('offer-detail', args=[self.offer.id]))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
