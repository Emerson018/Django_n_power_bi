# Portal Power BI Embedded 💎

Este projeto é um portal corporativo para visualização de dashboards do Power BI com segurança avançada, utilizando o fluxo **App Owns Data** (Service Principal). Todo o controle de acesso é gerenciado pelo backend (Django + DRF) e a interface é construída com **React + Tailwind CSS**.

---

## 🚀 Como rodar o projeto localmente

Siga os passos abaixo para preparar o ambiente e rodar o portal na sua máquina.

### 1. Pré-requisitos
Certifique-se de ter instalado:
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 2. Configurando o Backend (Django)

Navegue até a pasta `backend`:
```bash
cd backend
```

Crie e ative um ambiente virtual:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

Instale as dependências:
```bash
pip install -r requirements.txt
```

Prepare o banco de dados e dados iniciais:
```bash
python manage.py migrate
python manage.py seed_db.py  # Popula o banco com relatórios e categorias de exemplo
```

Inicie o servidor de desenvolvimento:
```bash
python manage.py runserver
```
O backend estará rodando em: `http://localhost:8000`

---

### 3. Configurando o Frontend (React)

Abra um novo terminal e navegue até a pasta `frontend`:
```bash
cd frontend
```

Instale as dependências:
```bash
npm install
```

Inicie o app:
```bash
npm start
```
O portal estará disponível em: `http://localhost:3000`

---

### 🔑 Credenciais de Acesso (Desenvolvimento)

Para acessar o painel administrativo e configurar relatórios:
- **Login:** `admin`
- **Senha:** `admin123`

---

## 🏗️ Arquitetura do Sistema

- **Backend**: Django REST Framework (DRF) com JWT para autenticação.
- **Frontend**: React SPA com roteamento dinâmico e visualizador de Power BI customizado.
- **Segurança**: Fluxo de Service Principal (OAuth2 MSAL) + RBAC interno no banco de dados.
- **Design**: Premium UI System baseado em Tailwind CSS com micro-interações de 500ms.

---
*Hospital Ernesto Dornelles - Analytics Hub*
