from rest_framework import permissions

class IsSystemAdmin(permissions.BasePermission):
    """
    Permissão personalizada que verifica se o usuário é superusuário 
    ou se possui a role de 'Admin' no sistema.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Superusuários sempre têm acesso
        if request.user.is_superuser:
            return True
            
        # Verifica se o nome de alguma role do usuário contém 'admin' (case insensitive)
        return request.user.roles.filter(name__icontains='admin').exists()
