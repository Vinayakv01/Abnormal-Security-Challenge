from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)
    phone_number = serializers.CharField(required=True)  # Ensure phone_number is required

    class Meta:
        model = User
        fields = ['id','username', 'email', 'role', 'password', 'phone_number']  # Include phone_number

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        return token