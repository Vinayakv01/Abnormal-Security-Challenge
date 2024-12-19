# Generated by Django 5.1.4 on 2024-12-19 10:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0003_remove_file_user_id_file_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='filesharelink',
            name='token',
            field=models.CharField(blank=True, max_length=255, unique=True),
        ),
    ]