from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'passwords', views.PasswordEntryViewSet, basename='password')
router.register(r'requests', views.PasswordRequestViewSet, basename='request')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.user_profile, name='user_profile'),
    
    # Admin endpoints
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # Router endpoints
    path('', include(router.urls)),
]
