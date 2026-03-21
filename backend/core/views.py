from django.db import models
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Dashboard, User, Role, DashboardType
from .serializers import UserSerializer, RegisterSerializer
from rest_framework import serializers

# Serializer simples para listagem no portal
class DashboardPortalSerializer(serializers.ModelSerializer):
    category_name = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
        source='category'
    )
    category_color = serializers.SlugRelatedField(
        read_only=True,
        slug_field='color',
        source='category'
    )
    category_id = serializers.PrimaryKeyRelatedField(
        read_only=True,
        source='category'
    )
    allowed_role_names = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
        source='allowed_roles'
    )
    allowed_role_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Role.objects.all(),
        source='allowed_roles',
        required=False
    )
    allowed_user_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        source='allowed_users',
        required=False
    )
    allowed_user_names = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='username',
        source='allowed_users'
    )
    class Meta:
        model = Dashboard
        fields = ('id', 'name', 'public_url', 'category_name', 'category_id', 'category_color', 'allowed_role_names', 'allowed_role_ids', 'allowed_user_ids', 'allowed_user_names', 'created_at')

class DashboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar dashboards permitidos para o usuário logado.
    """
    serializer_class = DashboardPortalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Dashboard.objects.all()
        
        # Filtro: Dashboards onde o usuário tem permissão direta, 
        # ou tem uma role associada ao dashboard.
        # Também garante que usuários com role 'Admin' ou 'Administrador' vejam tudo.
        user_roles = user.roles.all()
        if user_roles.filter(name__icontains='Admin').exists():
            return Dashboard.objects.all()

        return Dashboard.objects.filter(
            models.Q(allowed_users=user) | 
            models.Q(allowed_roles__in=user_roles)
        ).distinct()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
