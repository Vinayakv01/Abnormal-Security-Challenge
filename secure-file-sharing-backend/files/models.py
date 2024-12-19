from django.db import models
from django.conf import settings
import uuid
from django.utils import timezone

from users.models import User

class File(models.Model):
    file = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255, blank=True)  # Add the name field
    shared_with = models.ManyToManyField(User, related_name='shared_files', blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')

    def __str__(self):
        return self.name  # Show the name of the file

    def get_file_path(self):
        return self.file.path


class FileShareLink(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    expiration_time = models.DateTimeField()
    token = models.CharField(max_length=255, unique=True, blank=True)

    def __str__(self):
        return f"Link for {self.file.name} (expires {self.expiration_time})"

    def is_valid(self):
        """Check if the link is still valid."""
        return self.expiration_time > timezone.now()

    def generate_token(self):
        """Generate a unique token for the shareable link."""
        self.token = str(uuid.uuid4())
        self.save()