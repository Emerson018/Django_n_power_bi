from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Role, Dashboard, DashboardType, AuditLog

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
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(DashboardType)
class DashboardTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'created_at')
    search_fields = ('name',)
    filter_horizontal = ('allowed_roles', 'allowed_users')
    list_filter = ('category', 'created_at')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action_type', 'object_type', 'object_name', 'timestamp')
    list_filter = ('action_type', 'timestamp', 'object_type')
    search_fields = ('object_name', 'user__username')
    readonly_fields = ('user', 'action_type', 'object_type', 'object_name', 'timestamp')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
