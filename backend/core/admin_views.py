from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Dashboard, Role, AuditLog
from .serializers import UserSerializer, RegisterSerializer
from rest_framework import serializers

# Serializers Adicionais para Gestão
class DashboardSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = Dashboard
        fields = ('id', 'name', 'description', 'public_url', 'allowed_role_names', 'allowed_role_ids', 'created_at')

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = AuditLog
        fields = ('id', 'username', 'action', 'resource', 'description', 'timestamp')

# ViewSets de Administração
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        user = self.get_object()
        
        # Proteção: Não permitir que o usuário desative a si próprio
        if user == request.user:
            return Response(
                {"error": "Você não pode desativar sua própria conta."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = not user.is_active
        user.save()
        
        # Log da ação
        AuditLog.objects.create(
            user=request.user,
            action='UPDATE',
            resource=f"User: {user.username}",
            description=f"Status alterado para: {'Ativo' if user.is_active else 'Inativo'}"
        )
        
        return Response({'status': 'success', 'is_active': user.is_active})

class AdminDashboardViewSet(viewsets.ModelViewSet):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        dashboard = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            action='CREATE',
            resource='Dashboard',
            description=f"Criado dashboard: {dashboard.name}"
        )

class AdminAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminRoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]
