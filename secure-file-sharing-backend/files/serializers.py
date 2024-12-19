from rest_framework import serializers
from .models import File, FileShareLink

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'name', 'file', 'shared_with', 'uploaded_at', 'user']  # Include the 'name' field

    def validate_file(self, value):
        # Validate the file MIME type
        valid_mime_types = ['application/pdf', 'image/jpeg', 'image/png']
        if hasattr(value, 'file') and hasattr(value.file, 'content_type'):
            if value.file.content_type not in valid_mime_types:
                raise serializers.ValidationError("Invalid file type.")
        else:
            raise serializers.ValidationError("File is not in the expected format.")
        return value


class FileShareLinkSerializer(serializers.ModelSerializer):
    file = FileSerializer()
    token = serializers.CharField(read_only=True)  # Display token, but do not allow editing

    class Meta:
        model = FileShareLink
        fields = ['id', 'file', 'token', 'expiration_time']

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user  # Set owner to the current user
        # Create FileShareLink object and assign token
        file_share_link = super().create(validated_data)
        file_share_link.generate_token()  # Generate token after creating the link
        return file_share_link