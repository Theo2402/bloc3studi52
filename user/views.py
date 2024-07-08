from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404
from .models import UserProfile

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def destroy(self, request, *args, **kwargs):
        user = get_object_or_404(UserProfile, uuid=kwargs['pk'])
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
#from .custom_token import CustomRefreshToken

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        #token = CustomRefreshToken.for_user(user)
        print(token)
        # Add custom claims
        token['is_admin'] = user.is_staff 
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer

class UpdateUserAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        print(request.data)
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer

class RegisterUserAPIView(APIView):
    def post(self, request, *args, **kwargs):
        print("Received data:", request.data)  # Log the incoming data
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errors:", serializer.errors)  # Log errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
