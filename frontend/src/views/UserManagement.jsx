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

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium italic">Carregando usuários...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
            </div>

            <div className="bg-white shadow-xl shadow-gray-200/40 border border-gray-100 rounded-[32px] overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Usuário / Perfil</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">E-mail</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Cargo / Role</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Relatórios Acessíveis</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Ativar / Desativar</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50 dark:bg-gray-800 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-lg mr-4 border border-primary/10 shadow-sm group-hover:scale-110 transition-transform dark:bg-primary/20 dark:border-primary/30">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-800 tracking-tight dark:text-white">{user.username}</div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1 dark:text-gray-500">ID: #{String(user.id).padStart(3, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500 font-medium dark:text-gray-400">{user.email}</td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="relative inline-block w-48">
                                            <select 
                                                className="w-full text-xs font-bold uppercase tracking-wider py-2.5 px-4 pr-10 border border-gray-300 bg-white rounded-xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                                value={user.role_ids?.[0] || ""}
                                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                            >
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.id} className="dark:bg-gray-900 text-gray-700 dark:text-gray-200">{role.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 min-w-[250px]">
                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                                            {user.accessible_dashboards && user.accessible_dashboards.length > 0 ? (
                                                user.accessible_dashboards.map((db, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[9px] font-bold uppercase tracking-wider rounded-md border border-gray-200/50 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700 whitespace-nowrap">
                                                        {db}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic opacity-60">Nenhum acesso</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <div className="flex justify-end pr-4">
                                            <label className="relative inline-flex items-center cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer"
                                                    checked={user.is_active}
                                                    onChange={() => toggleUserStatus(user.id)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 shadow-inner group-active:scale-95 duration-200"></div>
                                                <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-gray-400 peer-checked:text-green-600 transition-colors">
                                                    {user.is_active ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
