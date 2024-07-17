from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import UserProfile
from .serializers import UserSerializer
import uuid

User = get_user_model()

class UserViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass', email='testuser@example.com', name='Test User')
        self.client.force_authenticate(user=self.user)

    def test_list_users(self):
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'username': 'newuser', 'password': 'newpass', 'email': 'newuser@example.com', 'name': 'New User'}
        response = self.client.post(reverse('user-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_user(self):
        user = User.objects.create_user(username='deleteuser', password='deletepass', email='deleteuser@example.com', name='Delete User')
        response = self.client.delete(reverse('user-detail', args=[user.uuid]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class MyTokenObtainPairViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass', email='testuser@example.com', name='Test User')

    def test_obtain_token(self):
        response = self.client.post('/api/token/', {'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

class UserSerializerTestCase(TestCase):
    def setUp(self):
        self.user_attributes = {
            'username': 'testuser',
            'password': 'testpass',
            'email': 'testuser@example.com',
            'name': 'Test User'
        }

    def test_valid_user_serializer(self):
        serializer = UserSerializer(data=self.user_attributes)
        self.assertTrue(serializer.is_valid())

    def test_invalid_user_serializer(self):
        invalid_data = self.user_attributes.copy()
        invalid_data['email'] = ''
        serializer = UserSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())

class IntegrationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_and_login(self):
        register_data = {
            'username': 'newuser',
            'password': 'newpass',
            'email': 'newuser@example.com',
            'name': 'New User'
        }
        response = self.client.post(reverse('register'), register_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        login_data = {'username': 'newuser', 'password': 'newpass'}
        response = self.client.post(reverse('token_obtain_pair'), login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
