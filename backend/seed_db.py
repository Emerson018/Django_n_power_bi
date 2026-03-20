import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User, Role, Dashboard

def seed():
    # 1. Criar Role Admin
    admin_role, _ = Role.objects.get_or_create(
        name='Admin', 
        defaults={'description': 'Acesso total ao sistema'}
    )
    
    # 2. Criar ou atualizar Admin User
    user, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com'})
    if created:
        user.set_password('admin')
        user.is_staff = True
        user.is_superuser = True
        user.roles.add(admin_role)
        user.save()
        print("Usuário admin criado com senha admin e Role Admin atribuída.")
    else:
        user.is_staff = True
        user.is_superuser = True
        user.roles.add(admin_role)
        user.set_password('admin')
        user.save()
        print("Usuário admin atualizado (senha admin aplicada e Role Admin garantida).")

    # 3. Criar Dashboards Iniciais
    dashboards_data = [
        {
            'name': 'Visão Geral',
            'public_url': 'https://app.powerbi.com/view?r=eyJrIjoiOTUxNTg4NmItMTRjNS00NjVmLTg2NzMtMTIwNjI0OGQxMWQ5IiwidCI6IjM2NWQxNWNjLTFkNGItNGQ5Ni04NWZhLTZmZGQxZTBjMzA4OCJ9',
            'description': 'Dashboard de Visão Geral da Operação'
        },
        {
            'name': 'KPIs de Tickets',
            'public_url': 'https://app.powerbi.com/view?r=eyJrIjoiOGFmMGQyNmEtYzJlNS00NTA1LTg4ZmItNzFiMGJkMmE0YjMzIiwidCI6IjM2NWQxNWNjLTFkNGItNGQ5Ni04NWZhLTZmZGQxZTBjMzA4OCJ9',
            'description': 'Indicadores de performance de atendimento'
        }
    ]

    for data in dashboards_data:
        db, created = Dashboard.objects.get_or_create(
            name=data['name'],
            defaults={
                'public_url': data['public_url'],
                'description': data['description']
            }
        )
        db.allowed_roles.add(admin_role)
        print(f"Dashboard '{db.name}' {'criado' if created else 'atualizado'}.")

if __name__ == '__main__':
    seed()
