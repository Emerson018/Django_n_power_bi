import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para lidar com expiração de token (Refresh Token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Pula se for a própria rota de login para evitar loops ou recarregamento
        if (originalRequest.url?.includes('/token/')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = sessionStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token");

                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                sessionStorage.setItem('accessToken', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Se o refresh falhar, desloga o usuário
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dashboards, setDashboards] = useState([]);
    const [isLoadingDashboards, setIsLoadingDashboards] = useState(false);

    const fetchDashboards = async () => {
        if (!sessionStorage.getItem('accessToken')) return;
        setIsLoadingDashboards(true);
        try {
            const response = await api.get('/dashboards/');
            setDashboards(response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao carregar dashboards", error);
        } finally {
            setIsLoadingDashboards(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.post('/token/', { username, password });
        sessionStorage.setItem('accessToken', response.data.access);
        sessionStorage.setItem('refreshToken', response.data.refresh);
        await loadUser();
        await fetchDashboards();
    };

    const register = async (userData) => {
        await api.post('/register/', userData);
    };

    const logout = () => {
        sessionStorage.clear(); // Limpa tudo rigorosamente
        setUser(null);
        setDashboards([]);
    };

    const loadUser = async () => {
        try {
            const response = await api.get('/user/');
            setUser(response.data);
            fetchDashboards();
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, login, logout, register, loading, api, 
            dashboards, fetchDashboards, isLoadingDashboards 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default api;
