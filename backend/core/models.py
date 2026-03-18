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
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Dashboard(models.Model):
    """
    Armazena os detalhes dos Dashboards (iFrame Público).
    """
    name = models.CharField(max_length=100, help_text="Nome amigável do Relatório")
    description = models.TextField(blank=True, null=True)
    public_url = models.URLField(max_length=500, help_text="Link público (iFrame) do Power BI")
    allowed_roles = models.ManyToManyField(Role, related_name='dashboards', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class AuditLog(models.Model):
    """
    Registra ações administrativas significativas.
    """
    ACTION_CHOICES = [
        ('CREATE', 'Criação'),
        ('UPDATE', 'Atualização'),
        ('DELETE', 'Remoção'),
        ('AUTH', 'Login/Logout'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    resource = models.CharField(max_length=100, help_text="Nome do recurso alterado")
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user} - {self.action} - {self.resource}"
