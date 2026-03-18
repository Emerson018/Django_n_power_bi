from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Role, Dashboard, AuditLog

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    filter_horizontal = ('roles', 'groups', 'user_permissions')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Controle de Acesso (RBAC)', {'fields': ('roles',)}),
    )

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('allowed_roles',)
    list_filter = ('created_at',)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'resource', 'timestamp')
    list_filter = ('action', 'timestamp')
    search_fields = ('description', 'resource', 'user__username')
    readonly_fields = ('user', 'action', 'resource', 'description', 'timestamp')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
