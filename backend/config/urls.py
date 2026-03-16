from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import DashboardViewSet

router = DefaultRouter()
router.register(r'dashboards', DashboardViewSet, basename='dashboard')

def api_root(request):
    return JsonResponse({"message": "PowerBI Portal API Ok"})

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    # JWT Auth Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # API Routes
    path('api/', include(router.urls)),
]
