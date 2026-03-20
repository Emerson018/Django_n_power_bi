import requests
import msal
from django.conf import settings

class PowerBIService:
    """
    Serviço de Integração com a Microsoft Azure e Power BI REST API
    Implementa a arquitetura 'App Owns Data' (Service Principal Flow)
    """
    def __init__(self):
        self.client_id = settings.POWERBI_CLIENT_ID
        self.client_secret = settings.POWERBI_CLIENT_SECRET
        self.tenant_id = settings.POWERBI_TENANT_ID

        if not self.client_id or not self.client_secret or not self.tenant_id:
            raise ValueError(
                "PowerBI não está configurado. Configure POWERBI_CLIENT_ID, POWERBI_CLIENT_SECRET e POWERBI_TENANT_ID "
                "ou use a API mock/sem integração."
            )

        self.authority_url = f"https://login.microsoftonline.com/{self.tenant_id}"
        self.scope = ["https://analysis.windows.net/powerbi/api/.default"]

    def get_access_token(self):
        """
        Autentica via Service Principal e retorna o Access Token da Azure AD.
        """
        app = msal.ConfidentialClientApplication(
            self.client_id,
            authority=self.authority_url,
            client_credential=self.client_secret
        )
        result = app.acquire_token_for_client(scopes=self.scope)
        if "access_token" in result:
            return result["access_token"]
        else:
            raise Exception(f"Erro AAD oauth: {result.get('error')} - {result.get('error_description')}")

    def get_embed_token_and_url(self, workspace_id, report_id):
        """
        Chama a REST API do Power BI para obter URL e Token de Incorporação seguro
        para o relatório especificado.
        """
        access_token = self.get_access_token()
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        
        # 1. Obter os detalhes do report (para a Embed URL)
        report_url = f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/reports/{report_id}"
        report_response = requests.get(report_url, headers=headers)
        if report_response.status_code != 200:
            raise Exception(f"Erro ao obter relatório do PowerBI API: {report_response.text}")
            
        report_data = report_response.json()
        embed_url = report_data.get("embedUrl")
        
        # 2. Gerar o Encode Token seguro e temporário
        token_url = f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/reports/{report_id}/GenerateToken"
        payload = {
            "accessLevel": "View",
            # Aqui poderíamos aplicar RLS (Row-Level Security) adicionando a flag 'identities'
        }
        token_response = requests.post(token_url, headers=headers, json=payload)
        
        if token_response.status_code != 200:
            raise Exception(f"Erro ao gerar Embed Token: {token_response.text}")
            
        embed_token = token_response.json().get("token")
        
        return {
            "embedToken": embed_token,
            "embedUrl": embed_url,
            "reportId": report_id,
        }
