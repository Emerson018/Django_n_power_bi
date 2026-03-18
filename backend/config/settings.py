from pathlib import Path
from datetime import timedelta
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-powerbi-portal-key')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # Local
    'core.apps.CoreConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = []
AUTH_USER_MODEL = 'core.User'

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True  # Para desenvolvimento apenas

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# Credenciais do Power BI (Service Principal)
POWERBI_CLIENT_ID = config('POWERBI_CLIENT_ID')
POWERBI_CLIENT_SECRET = config('POWERBI_CLIENT_SECRET')
POWERBI_TENANT_ID = config('POWERBI_TENANT_ID')
# Jazzmin Configuration
JAZZMIN_SETTINGS = {
    "site_title": "Portal BI Admin",
    "site_header": "Portal BI",
    "site_brand": "Gestão de Dashboards",
    "welcome_sign": "Bem-vindo ao Painel Administrativo",
    "copyright": "BI Portal Corp",
    "search_model": ["core.User", "core.Dashboard"],
    "colors": {
        "primary": "#003B67",
        "secondary": "#88B26C",
    },
    "theme": "flatly",
    "icons": {
        "core.User": "fas fa-users-cog",
        "core.Role": "fas fa-user-shield",
        "core.Dashboard": "fas fa-chart-pie",
        "core.AuditLog": "fas fa-history",
    },
}
# Segurança para iFrame (Desativada para desenvolvimento local via Middleware)
# X_FRAME_OPTIONS = 'SAMEORIGIN'
