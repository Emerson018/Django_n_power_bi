from rest_framework import serializers
from .models import User, Role

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

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active', 'role_names', 'role_ids')

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
