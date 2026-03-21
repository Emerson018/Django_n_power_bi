from rest_framework import serializers
from .models import User, Role, Dashboard
from django.db.models import Q

class UserSerializer(serializers.ModelSerializer):
    role_names = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
        source='roles'
    )
    role_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Role.objects.all(),
        source='roles',
        required=False
    )
    accessible_dashboards = serializers.SerializerMethodField()
    specific_dashboard_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Dashboard.objects.all(),
        source='specific_dashboards',
        required=False
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active', 'role_names', 'role_ids', 'accessible_dashboards', 'specific_dashboard_ids')

    def get_accessible_dashboards(self, obj):
        # Use prefetched roles to avoid query
        roles = list(obj.roles.all())
        is_admin = obj.is_superuser or any('admin' in r.name.lower() for r in roles)
        
        if is_admin:
            # Cache all dashboard names in context for the duration of the request
            if 'all_dashboards_names' not in self.context:
                self.context['all_dashboards_names'] = list(Dashboard.objects.all().values_list('name', flat=True))
            return sorted(self.context['all_dashboards_names'])
        
        # For non-admins, get from roles and specific dashboards (prefetched)
        accessible = set()
        
        # Add dashboards from roles
        for role in roles:
            # This still might trigger queries if not prefetched on the roles themselves.
            # But the AdminUserViewSet prefetches roles on users, not dashboards on roles.
            # Let's keep it simple for now as roles are usually few.
            accessible.update(role.dashboards.all().values_list('name', flat=True))
            
        # Add specific dashboards (prefetched)
        accessible.update(obj.specific_dashboards.all().values_list('name', flat=True))
        
        return sorted(list(accessible))

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Atribui role padrão 'Usuário' se existir
        default_role, created = Role.objects.get_or_create(name='Usuário')
        user.roles.add(default_role)
        return user
