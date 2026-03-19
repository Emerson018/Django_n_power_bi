from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from crum import get_current_user
from .models import User, Dashboard, DashboardType, AuditLog

def log_action(instance, action_type, object_type):
    user = get_current_user()
    
    # Se o salvamento for do próprio sistema ou sem request (ex: management commands), user pode ser None
    # No caso de criação de usuário (registro), o usuário logado ainda não existe ou é anônimo
    if not user or user.is_anonymous:
        # Tenta ver se a instância é um usuário sendo criado
        if isinstance(instance, User) and action_type == 'Inserção':
            log_user = instance
        else:
            log_user = None
    else:
        log_user = user

    object_name = getattr(instance, 'name', None) or getattr(instance, 'username', 'N/A')

    AuditLog.objects.create(
        user=log_user,
        action_type=action_type,
        object_type=object_type,
        object_name=object_name
    )

@receiver(post_save, sender=Dashboard)
def dashboard_saved(sender, instance, created, **kwargs):
    action = 'Inserção' if created else 'Edição'
    log_action(instance, action, 'Dashboard')

@receiver(post_delete, sender=Dashboard)
def dashboard_deleted(sender, instance, **kwargs):
    log_action(instance, 'Remoção', 'Dashboard')

@receiver(post_save, sender=DashboardType)
def dashboard_type_saved(sender, instance, created, **kwargs):
    action = 'Inserção' if created else 'Edição'
    log_action(instance, action, 'Categoria')

@receiver(post_delete, sender=DashboardType)
def dashboard_type_deleted(sender, instance, **kwargs):
    log_action(instance, 'Remoção', 'Categoria')

@receiver(post_save, sender=User)
def user_saved(sender, instance, created, **kwargs):
    action = 'Inserção' if created else 'Edição'
    log_action(instance, action, 'Usuário')

@receiver(post_delete, sender=User)
def user_deleted(sender, instance, **kwargs):
    log_action(instance, 'Remoção', 'Usuário')
