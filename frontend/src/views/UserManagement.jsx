import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { api } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                api.get('/admin/users/'),
                api.get('/admin/roles/')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId) => {
        try {
            await api.post(`/admin/users/${userId}/toggle_status/`);
            fetchData();
        } catch (error) {
            const message = error.response?.data?.error || "Erro ao alterar status do usuário";
            alert(message);
        }
    };

    const removeCurrentRoles = async (userId) => {
        // O DRF por padrão vai sobrescrever ao enviar role_ids, então só precisamos patch
    };

    const updateUserRole = async (userId, roleId) => {
        try {
            await api.patch(`/admin/users/${userId}/`, {
                role_ids: [roleId]
            });
            fetchData();
        } catch (error) {
            alert("Erro ao atualizar role do usuário");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Carregando usuários...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Gestão de Usuários</h2>
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil / Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{user.username}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select 
                                        className="text-sm border-gray-200 rounded-md focus:ring-secondary focus:border-secondary transition-all"
                                        value={user.role_ids?.[0] || ""}
                                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                                    >
                                        <option value="">Sem Role</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => toggleUserStatus(user.id)}
                                        className={`${user.is_active ? 'text-tertiary hover:text-tertiary/80' : 'text-secondary hover:text-secondary/80'} font-semibold`}
                                    >
                                        {user.is_active ? 'Desativar' : 'Ativar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
