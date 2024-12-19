from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminUser, IsRegularUser, IsGuestUser
from .models import File, FileShareLink
from .serializers import FileSerializer, FileShareLinkSerializer
from django.utils.crypto import get_random_string
from datetime import datetime, timedelta, timezone
import os
from .encryption import FileEncryption  # Encryption logic for AES-256
from django.conf import settings
from django.db import models  # Ensure this import exists only in models.py
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
import logging
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404


# Encryption Key (use an environment variable for security)
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "default_dummy_key").encode()
logger = logging.getLogger(__name__)

# Admin View: Manage all users and files
class AdminFileManagementView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        files = File.objects.all()
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)

    def delete(self, request, file_id):
        try:
            file = File.objects.get(id=file_id)
            file.delete()
            return Response({"message": "File deleted successfully"})
        except File.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)


# Regular User View: Upload, Download, Share files
class UserFileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Ensure multipart data is parsed

    def get(self, request, file_id=None):
        """Fetch files owned by the user or download a file if `file_id` is provided."""
        if file_id:
            # Handle file download
            return self.download(request, file_id)
        else:
            # Fetch files
            files = File.objects.filter(user=request.user)
            role = "user"  # Default role
            if request.user.is_staff:
                role = "admin"
            elif hasattr(request.user, 'guestprofile'):
                role = "guest"

            # Serialize files and add the role info
            file_serializer = FileSerializer(files, many=True)

            return Response({
                "role": role,
                "files": file_serializer.data
            })

    def post(self, request, *args, **kwargs):
        """Handle file upload."""
        uploaded_file = request.FILES.get('file')

        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file type and size
        valid_mime_types = ['application/pdf', 'image/jpeg', 'image/png']
        if uploaded_file.content_type not in valid_mime_types:
            return Response({"error": "Invalid file type."}, status=status.HTTP_400_BAD_REQUEST)

        max_file_size = 10 * 1024 * 1024  # 10MB
        if uploaded_file.size > max_file_size:
            return Response({"error": "File size exceeds 10MB limit."}, status=status.HTTP_400_BAD_REQUEST)

        # Save file metadata, including file name
        file_instance = File.objects.create(
            file=uploaded_file,
            name=uploaded_file.name,  # Store the file name
            user=request.user
        )

        # Serialize the saved file and return the metadata
        serializer = FileSerializer(file_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def download(self, request, file_id):
        try:
            # Check if the file exists in the database for the user
            file = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the file exists in the uploads directory
        file_path = file.get_file_path()
        if not os.path.exists(file_path):
            return Response({"error": "File not found on the server"}, status=status.HTTP_404_NOT_FOUND)

        # Use FileResponse to serve the file
        response = FileResponse(open(file_path, 'rb'), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response




    def post_share(self, request, *args, **kwargs):
        if request.content_type == 'application/json':
            file_id = request.data.get("file_id")  # Get file ID from request
            expires_in = int(request.data.get("expires_in", 24))  # Default expiration 24 hours
        else:
            file_id = request.data.get("file_id")
            expires_in = int(request.data.get("expires_in", 24))

        if not file_id:
            return Response({"error": "File ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        token = get_random_string(64)

        share_link = FileShareLink.objects.create(
            file=file,
            token=token,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=expires_in)
        )

        shareable_url = f"{request.build_absolute_uri('/share/')}{token}"

        return Response({"shareable_link": shareable_url}, status=status.HTTP_201_CREATED)


    


# Guest View: View shared files only
class GuestFileView(APIView):
    permission_classes = [IsAuthenticated, IsGuestUser]

    def get(self, request):
        """View shared files only."""
        shared_files = File.objects.filter(shared_with=request.user)
        serializer = FileSerializer(shared_files, many=True)
        return Response(serializer.data)


# Shared File Access View
class SharedFileAccessView(APIView):
    permission_classes = []  # No need for authentication here

    def get(self, request, token):
        """Access a shared file using a token."""
        try:
            link = FileShareLink.objects.get(token=token)
        except FileShareLink.DoesNotExist:
            return Response({"error": "Invalid or expired link"}, status=status.HTTP_404_NOT_FOUND)

        if not link.is_valid():
            return Response({"error": "Link has expired"}, status=status.HTTP_410_GONE)

        file = link.file
        encryption = FileEncryption(ENCRYPTION_KEY)
        decrypted_file = encryption.decrypt(file.file.read())

        response = Response(decrypted_file, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response
    
    