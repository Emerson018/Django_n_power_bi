from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Modelo de Usuário Estendido.
    """
    roles = models.ManyToManyField('Role', related_name='users', blank=True)

class Role(models.Model):
    """
    Representa as roles do sistema (ex: Admin, GerenteVendas, AnalistaSuporte).
    """
    name = models.CharField(max_length=50, unique=True, help_text="Nome da Role")
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class PBIReport(models.Model):
    """
    Armazena os detalhes dos Relatórios do Power BI.
    """
    workspace_id = models.CharField(max_length=255, help_text="ID do Workspace no Power BI")
    report_id = models.CharField(max_length=255, help_text="ID do Relatório no Power BI")
    name = models.CharField(max_length=100, help_text="Nome amigável do Relatório")
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('workspace_id', 'report_id')

    def __str__(self):
        return f"{self.name} ({self.report_id})"

class RoleReportPermission(models.Model):
    """
    Mapeamento Many-to-Many entre Roles e PBIReports para controle de RBAC.
    """
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='report_permissions')
    report = models.ForeignKey(PBIReport, on_delete=models.CASCADE, related_name='role_permissions')
    can_view = models.BooleanField(default=True, help_text="Define se a role pode visualizar este relatório")

    class Meta:
        unique_together = ('role', 'report')

    def __str__(self):
        return f"{self.role.name} -> {self.report.name}"
