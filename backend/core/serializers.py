from rest_framework import serializers
from .models import User, Role
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

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active', 'role_names', 'role_ids', 'accessible_dashboards')

    def get_accessible_dashboards(self, obj):
        from .models import Dashboard
        # Se for superusuário ou admin, vê tudo
        if obj.is_superuser or obj.roles.filter(name__icontains='Admin').exists():
            return sorted(list(Dashboard.objects.all().values_list('name', flat=True)))
        
        # Caso contrário, filtra por acesso direto ou via role
        user_roles = obj.roles.all()
        dashboards = Dashboard.objects.filter(
            Q(allowed_users=obj) | 
            Q(allowed_roles__in=user_roles)
        ).distinct()
        return sorted(list(dashboards.values_list('name', flat=True)))

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
