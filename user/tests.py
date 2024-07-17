from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class UserViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass', email='testuser@example.com', name='Test User')
        self.client.force_authenticate(user=self.user)

    def test_list_users(self):
        response = self.client.get('/api/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'username': 'newuser', 'password': 'newpass', 'email': 'newuser@example.com', 'name': 'New User'}
        response = self.client.post('/api/user/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_user(self):
        user = User.objects.create_user(username='deleteuser', password='deletepass', email='deleteuser@example.com', name='Delete User')
        user_uuid = user.uuid  
        response = self.client.delete(f'/api/user/{user_uuid}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)



