from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Dashboard, User, Role
from .serializers import UserSerializer, RegisterSerializer
from rest_framework import serializers

# Serializer simples para listagem no portal
class DashboardPortalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = ('id', 'name', 'description', 'public_url')

class DashboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar dashboards permitidos para o usuário logado.
    """
    serializer_class = DashboardPortalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna dashboards que possuem Roles compatíveis com as do usuário.
        """
        user = self.request.user
        if user.is_superuser:
            return Dashboard.objects.all()
            
        user_roles = user.roles.all()
        return Dashboard.objects.filter(allowed_roles__in=user_roles).distinct()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
