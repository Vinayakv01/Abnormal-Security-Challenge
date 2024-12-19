from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Define role choices
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
        ('guest', 'Guest'),
    ]

    # Role field with choices
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    # Ensure email is unique
    email = models.EmailField(unique=True)

    # Add phone number field
    phone_number = models.CharField(max_length=15, null=True, blank=True)  # Optional for phone-based login

    # Set email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # You can include username here or leave it out if not needed

    def __str__(self):
        return self.email  # Or return self.username depending on your preference
