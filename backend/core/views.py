from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import PBIReport, RoleReportPermission
from .services.powerbi_service import PowerBIService
# from .serializers import PBIReportSerializer

class DashboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar relatórios permitidos e gerar tokens de embed.
    """
    # serializer_class = PBIReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna a lista dos relatórios que a Role do usuário logado permite visualizar (filtrado no banco).
        """
        user = self.request.user
        user_roles = user.roles.all()
        
        allowed_reports_ids = RoleReportPermission.objects.filter(
            role__in=user_roles, can_view=True
        ).values_list('report_id', flat=True)
        
        return PBIReport.objects.filter(id__in=allowed_reports_ids)

    @action(detail=True, methods=['get'], url_path='embed-data')
    def embed_data(self, request, pk=None):
        """
        ENDPOINT CRUCIAL:
        Verifica a permissão do usuário no banco e, se autorizado, 
        chama o serviço PBI para gerar e retornar o EmbedURL e o EmbedToken temporário.
        """
        try:
            # get_object() usa get_queryset(), que já garante que o usuário tem acesso (RBAC)
            report = self.get_object() 
        except Exception:
            return Response({"error": "Acesso negado ou relatório não encontrado."}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            pbi_service = PowerBIService()
            embed_data = pbi_service.get_embed_token_and_url(
                workspace_id=report.workspace_id,
                report_id=report.report_id
            )
            return Response(embed_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
