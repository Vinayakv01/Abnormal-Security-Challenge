from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth import get_user_model

from files.permissions import IsAdminUser
from .serializers import UserSerializer
from rest_framework_simplejwt.exceptions import TokenError
from twilio.rest import Client
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .utils.twilio_utils import send_otp
from random import randint
from rest_framework.permissions import AllowAny
from django.core.cache import cache  # To store OTP temporarily
import random
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import connection
from dotenv import load_dotenv
import os

User = get_user_model() 

# Load environment variables from .env file
load_dotenv()

# Retrieve Twilio credentials from environment variables
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]  # Only allow admin users

    def get(self, request):
        """
        Retrieve a list of all users, only accessible by admins.
        """
        users = User.objects.all()  # Get all users
        serializer = UserSerializer(users, many=True)  # Serialize the user data
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AdminUserDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]  # Only admins can access

    def delete(self, request, user_id):
        """
        Delete a user by their ID, only accessible by admins.
        Specifically deletes from the 'users.user' table.
        """
        try:
            # Execute raw SQL to delete the user from the 'users.user' table
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM users_user WHERE id = %s", [user_id])
                
            # Check if the user was actually deleted
            if cursor.rowcount == 0:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            
            return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserRegisterView(APIView):
    permission_classes = []  # Allow access to everyone (unauthenticated users)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Authenticate user using email and password
        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Retrieve phone number from the user object
        phone_number = user.phone_number  # Assuming `phone_number` is a field in the User model
        if not phone_number:
            return Response({"error": "No phone number associated with this user."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 3: Generate OTP
        otp = randint(100000, 999999)

        # Step 4: Store OTP in cache for 5 minutes
        cache.set(email, otp, timeout=300)

        # Step 5: Send OTP via Twilio
        try:
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            client.messages.create(
                body=f"Your OTP is {otp}",
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            return Response({"message": "OTP sent to your registered phone number."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to send OTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Get the user associated with the provided email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Retrieve the phone number associated with the email
        phone_number = user.phone_number  # Assuming `phone_number` is a field in the User model
        if not phone_number:
            return Response({"error": "No phone number associated with this email."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 3: Generate OTP
        otp = random.randint(100000, 999999)

        # Step 4: Store OTP in cache for 5 minutes (300 seconds)
        cache.set(email, otp, timeout=300)

        # Step 5: Send OTP via Twilio
        try:
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            client.messages.create(
                body=f"Your OTP is {otp}",
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            return Response({"message": "OTP sent to your registered phone number."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Failed to send OTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        # Validate OTP
        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        cached_otp = cache.get(email)
        if cached_otp is None:
            return Response({"error": "OTP has expired or is invalid."}, status=status.HTTP_400_BAD_REQUEST)

        if str(cached_otp) != str(otp):
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Generate a JWT access token after OTP verification
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Step 2: Create the access token (short-lived)
        access_token = AccessToken.for_user(user)

        # Step 3: Serialize user data
        user_data = UserSerializer(user).data  # Serialize user instance

        # Step 4: Return the access token and user data
        return Response({
            "message": "OTP verified successfully, you are now logged in.",
            "access_token": str(access_token),  # JWT access token
            "user": user_data,  # Include user details with ID
        }, status=status.HTTP_200_OK)


class UserLogoutView(APIView):
    def post(self, request):
        try:
            # Get the refresh token from the request
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response({"error": "No refresh token provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Create a RefreshToken instance
            token = RefreshToken(refresh_token)

            # Blacklist the refresh token so it cannot be used again
            token.blacklist()

            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        
        except TokenError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CheckAuthView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        # User is authenticated, return user details
        user = request.user  # Request object contains the user after authentication
        user_data = {
            "id": user.id,  # Include the user ID
            "email": user.email,
            "username": user.username,
            "role": user.role  # Assuming 'role' field exists
        }
        return Response({
            "message": "User is authenticated.",
            "user": user_data
        }, status=status.HTTP_200_OK)


class ProtectedRouteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "You have accessed a protected route!",
            "user": {
                "email": request.user.email,
                "username": request.user.username,
                "role": request.user.role
            }
        }, status=status.HTTP_200_OK)
    
    

    