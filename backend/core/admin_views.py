from rest_framework import viewsets, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Dashboard, Role, DashboardType, AuditLog
from .serializers import UserSerializer, RegisterSerializer
from rest_framework import serializers

class DashboardTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardType
        fields = ('id', 'name', 'color')

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
        queryset=DashboardType.objects.all(),
        source='category',
        required=False,
        allow_null=True
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

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = AuditLog
        fields = ('id', 'username', 'action_type', 'object_type', 'object_name', 'timestamp')

class AuditLogPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100

# ViewSets de Administração
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().prefetch_related('roles', 'specific_dashboards')
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
        return Response({'status': 'success', 'is_active': user.is_active})

class AdminDashboardViewSet(viewsets.ModelViewSet):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = AuditLogPagination

class AdminRoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminDashboardTypeViewSet(viewsets.ModelViewSet):
    queryset = DashboardType.objects.all()
    serializer_class = DashboardTypeSerializer
    permission_classes = [permissions.IsAdminUser]
