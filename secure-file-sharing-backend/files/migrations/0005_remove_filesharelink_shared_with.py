# Generated by Django 5.1.4 on 2024-12-19 11:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0004_file_name_filesharelink_token'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='filesharelink',
            name='shared_with',
        ),
    ]
