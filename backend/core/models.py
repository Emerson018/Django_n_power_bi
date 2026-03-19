from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Modelo de Usuário Estendido.
    """
    roles = models.ManyToManyField('Role', related_name='users', blank=True)

    def __str__(self):
        return self.username

class Role(models.Model):
    """
    Representa as roles do sistema (ex: Admin, GerenteVendas, AnalistaSuporte).
    """
    name = models.CharField(max_length=50, unique=True, help_text="Nome da Role")

    def __str__(self):
        return self.name

class DashboardType(models.Model):
    """
    Representa os tipos/categorias de dashboards (ex: Financeiro, Médico).
    """
    name = models.CharField(max_length=100, unique=True, help_text="Nome do Tipo de Dashboard")

    def __str__(self):
        return self.name

class Dashboard(models.Model):
    """
    Armazena os detalhes dos Dashboards (iFrame Público).
    """
    name = models.CharField(max_length=100, help_text="Nome amigável do Relatório")
    public_url = models.URLField(max_length=500, help_text="Link público (iFrame) do Power BI")
    dashboard_types = models.ManyToManyField(DashboardType, related_name='dashboards', blank=True)
    allowed_roles = models.ManyToManyField(Role, related_name='dashboards', blank=True)
    allowed_users = models.ManyToManyField(User, related_name='specific_dashboards', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('Inserção', 'Inserção'),
        ('Edição', 'Edição'),
        ('Remoção', 'Remoção'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action_type = models.CharField(max_length=20, choices=ACTION_CHOICES, default='Edição')
    object_type = models.CharField(max_length=50, default='Outro') # Dashboard, Categoria, Usuário
    object_name = models.CharField(max_length=255, default='N/A')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action_type} - {self.object_type}: {self.object_name}"
