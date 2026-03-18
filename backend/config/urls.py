from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import DashboardViewSet, RegisterView, UserProfileView
from core.admin_views import AdminUserViewSet, AdminDashboardViewSet, AdminAuditLogViewSet

router = DefaultRouter()
router.register(r'dashboards', DashboardViewSet, basename='dashboard')

# Rotas de Administração (Híbridas)
admin_router = DefaultRouter()
admin_router.register(r'users', AdminUserViewSet, basename='admin-users')
admin_router.register(r'dashboards', AdminDashboardViewSet, basename='admin-dashboards')
admin_router.register(r'audit', AdminAuditLogViewSet, basename='admin-audit')

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
    
    # API Routes (Portal)
    path('api/', include(router.urls)),
    
    # API Routes (Admin Híbrido)
    path('api/admin/', include(admin_router.urls)),
]
