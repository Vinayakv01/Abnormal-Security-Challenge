from django.urls import path
from .views import UserRegisterView, UserLogoutView, UserLoginView, VerifyOTPView, SendOTPView, ProtectedRouteView, CheckAuthView
from .views import CustomTokenObtainPairView, AdminUserListView, AdminUserDeleteView


urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="user-register"),
    path("logout/", UserLogoutView.as_view(), name="user-logout"),
    path("login/", UserLoginView.as_view(), name="user-login"),
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('protected-route/', ProtectedRouteView.as_view(), name='protected-route'),
    path('checkauth/', CheckAuthView.as_view(), name='check_auth'),  # Define the URL pattern for CheckAuthView

    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),  # Admin view to list users
    path('admin/users/<int:user_id>/delete/', AdminUserDeleteView.as_view(), name='admin-user-delete'),

]
