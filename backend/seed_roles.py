import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Role

def seed_roles():
    roles = [
        {'name': 'Admin', 'description': 'Acesso total ao sistema e gestão de dashboards.'},
        {'name': 'Usuário', 'description': 'Acesso básico para visualização de dashboards atribuídos.'},
    ]

    for role_data in roles:
        role, created = Role.objects.get_or_create(name=role_data['name'], defaults={'description': role_data['description']})
        if created:
            print(f"Role '{role.name}' criada.")
        else:
            print(f"Role '{role.name}' já existe.")

if __name__ == "__main__":
    seed_roles()
