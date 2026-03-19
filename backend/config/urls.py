from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import DashboardViewSet, RegisterView, UserProfileView
from core.admin_views import (
    AdminUserViewSet, AdminDashboardViewSet, AdminAuditLogViewSet, 
    AdminRoleViewSet, AdminDashboardTypeViewSet
)

router = DefaultRouter()
router.register(r'dashboards', DashboardViewSet, basename='dashboard')
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')
router.register(r'admin/dashboards', AdminDashboardViewSet, basename='admin-dashboards')
router.register(r'admin/audit-logs', AdminAuditLogViewSet, basename='admin-audit-logs')
router.register(r'admin/roles', AdminRoleViewSet, basename='admin-roles')
router.register(r'admin/dashboard-types', AdminDashboardTypeViewSet, basename='admin-dashboard-types')

def api_root(request):
    return JsonResponse({"message": "PowerBI Portal API Ok"})

urlpatterns = [
    path('', api_root),
    path('admin/', admin_core_site := admin.site.urls), # Reutilizando admin do Django
    
    # JWT Auth Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/user/', UserProfileView.as_view(), name='user_profile'),
    
    # API Routes
    path('api/', include(router.urls)),
]
