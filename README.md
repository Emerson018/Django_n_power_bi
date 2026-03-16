# Portal Power BI Embedded

## Arquitetura: App Owns Data (Service Principal Flow)

A estrutura abaixo implementa um portal seguro onde os usuários não precisam de contas do Power BI (nem licenças Pro). O backend (Django) autentica com a Azure AD usando uma conta de serviço (Service Principal) e gera tokens temporários e seguros para que o frontend (React) renderize apenas os relatórios que o usuário tem acesso (RBAC).

## Estrutura de Diretórios e Arquivos Mapeados no Workspace

```text
/powerbi_django
│
├── /backend                    (Django + DRF)
│   ├── /core
│   │   ├── models.py           # Modelos de Data (User, Role, PBIReport, RoleReportPermission)
│   │   ├── views.py            # API para Listar e Obter Tokens Temporários seguros de Embed
│   │   ├── services/
│   │   │   └── powerbi_service.py # Lida com OAuth2 (MSAL) e chamadas a Power BI REST API
│   │
├── /frontend                   (React SPA)
│   ├── /src
│   │   ├── /components
│   │   │   └── PowerBIEmbedViewer.jsx  # Configura PBI Client React com TokenType.Embed
│   │   ├── /views
│   │   │   ├── DashboardListView.jsx   # Barra lateral c/ Lista permitida e renderização do iframe
│   │   │   └── LoginView.jsx           # Autenticação p/ JWT com o backend (DRF SimpleJWT)
```

## Fluxo de Segurança (End-to-End)

1. Usuário abre a SPA (React) e cai no `LoginView.jsx`.
2. O formulário envia credenciais para `/api/token/` (SimpleJWT do Django).
3. Após login, ele acessa o `DashboardListView.jsx`.
4. O Frontend chama `GET /api/dashboards/`.
5. O `DashboardViewSet` vê que o usuário é "GerenteVendas" (exemplo), e filtra do banco só os Reports mapeados via `RoleReportPermission`.
6. O Frontend mostra a lista. O usuário clica no Relatório Vendas.
7. O Frontend chama `GET /api/dashboards/vendas/embed-data/`.
8. O Django confirma que o usuário logado e sua Role possuem `can_view=True` na tabela M-M.
9. O Django chama a classe `PowerBIService`:
   - Envia ClientID, Secret e TenantID pro Azure.
   - Pega um `access token` master.
   - Pede à API do Power BI para gerar um `embed token` temporário, com `accessLevel: "View"`, só para o ID do daquele report/workspace.
10. O Django devolve pro React: `{embedToken, embedUrl, reportId}`.
11. O React passa essas credenciais pro `PowerBIEmbedViewer.jsx` via `powerbi-client-react`. O iframe é renderizado com segurança total e sem links públicos soltos na internet.
