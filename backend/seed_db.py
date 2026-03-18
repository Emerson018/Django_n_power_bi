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
    
    # 2. Vincular Admin User à Role
    user = User.objects.filter(username='admin').first()
    if user:
        user.roles.add(admin_role)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"Usuário {user.username} atualizado com Role Admin.")

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
