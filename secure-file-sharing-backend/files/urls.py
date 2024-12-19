from django.urls import path
from .views import AdminFileManagementView, UserFileView, GuestFileView, SharedFileAccessView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # Admin View: Manage all files
    path('admin/files/', AdminFileManagementView.as_view(), name='admin_file_management'),

    # Regular User Views: Upload, download, and share files
    path('user/files/', UserFileView.as_view(), name='user-files'),
    path('user/files/share/', UserFileView.as_view(), name='user_file_share'),  # Updated to remove file_id
    path('user/files/download/<int:file_id>/', UserFileView.as_view(), name='file-download'),  # Download file
    # Guest View: View shared files only
    path('guest/files/', GuestFileView.as_view(), name='guest_file_management'),

    # Shared File Access: Access a shared file by token
    path('share/<str:token>/', SharedFileAccessView.as_view(), name='shared_file_access'),
    
]

if settings.DEBUG:
   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
