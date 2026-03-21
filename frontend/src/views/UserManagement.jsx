import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { api } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [allDashboards, setAllDashboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserForAccess, setSelectedUserForAccess] = useState(null);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes, dashboardsRes] = await Promise.all([
                api.get('/admin/users/'),
                api.get('/admin/roles/'),
                api.get('/admin/dashboards/')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
            setAllDashboards(dashboardsRes.data);
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
            {selectedUserForAccess && (
                <DashboardAccessModal 
                    user={selectedUserForAccess}
                    allDashboards={allDashboards}
                    isAdmin={roles.find(r => r.id === selectedUserForAccess.role_ids?.[0])?.name?.toLowerCase() === 'admin'}
                    onClose={() => setSelectedUserForAccess(null)}
                    onSave={async (dashboardIds) => {
                        try {
                            await api.patch(`/admin/users/${selectedUserForAccess.id}/`, {
                                specific_dashboard_ids: dashboardIds
                            });
                            setSelectedUserForAccess(null);
                            fetchData();
                        } catch (error) {
                            alert("Erro ao atualizar acessos do usuário");
                        }
                    }}
                />
            )}
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
                                    <td 
                                        className="px-8 py-6 min-w-[250px] transition-all cursor-pointer hover:bg-white/5 active:bg-primary/10"
                                        onClick={() => setSelectedUserForAccess(user)}
                                        title="Clique para gerenciar acessos"
                                    >
                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2 custom-scrollbar pointer-events-none">
                                            {(() => {
                                                const userRole = roles.find(r => r.id === user.role_ids?.[0]);
                                                const isAdmin = userRole?.name?.toLowerCase() === 'admin';
                                                const dashboards = user.accessible_dashboards || [];

                                                if (isAdmin) {
                                                    return (
                                                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg border border-secondary/20 shadow-sm animate-in fade-in zoom-in duration-500">
                                                            🚀 Todos Relatórios
                                                        </span>
                                                    );
                                                }

                                                if (dashboards.length === 0) {
                                                    return <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic opacity-60">Nenhum acesso</span>;
                                                }

                                                const maxVisible = 3;
                                                const visibleDashboards = dashboards.slice(0, maxVisible);
                                                const remainingCount = dashboards.length - maxVisible;

                                                return (
                                                    <>
                                                        {visibleDashboards.map((db, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[9px] font-bold uppercase tracking-wider rounded-md border border-gray-200/50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 whitespace-nowrap">
                                                                {db}
                                                            </span>
                                                        ))}
                                                        {remainingCount > 0 && (
                                                            <span 
                                                                className="px-2 py-0.5 bg-primary/5 text-primary dark:bg-primary/20 dark:text-primary-light text-[9px] font-black uppercase tracking-wider rounded-md border border-primary/20 hover:bg-primary/10 transition-colors"
                                                            >
                                                                +{remainingCount}
                                                            </span>
                                                        )}
                                                    </>
                                                );
                                            })()}
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

const DashboardItem = memo(({ db, isSelected, onClick }) => (
    <div 
        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
        onClick={() => onClick(db.id)}
    >
        <div className="flex flex-col">
            <span className="text-sm font-black text-gray-800 dark:text-gray-100 leading-tight">{db.name}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{db.category_name || 'Sem Categoria'}</span>
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isSelected ? 'bg-green-500 shadow-inner' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isSelected ? 'translate-x-6' : ''}`}></div>
        </div>
    </div>
));

const DashboardAccessModal = ({ user, allDashboards, onClose, onSave, isAdmin }) => {
    const [selectedIds, setSelectedIds] = useState(new Set(
        isAdmin ? allDashboards.map(d => d.id) : (user.specific_dashboard_ids || [])
    ));
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDashboard = useCallback((id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const filteredDashboards = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return allDashboards.filter(db => 
            db.name.toLowerCase().includes(term) ||
            db.category_name?.toLowerCase().includes(term)
        );
    }, [allDashboards, searchTerm]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-primary/40" onClick={onClose}></div>
            
            <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-950/30">
                    <div>
                        <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Gerenciar Acessos</h2>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Usuário: {user.username}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8">
                    <div className="relative mb-6">
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou categoria..." 
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm text-gray-700 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar overscroll-contain">
                        {filteredDashboards.map(db => (
                            <DashboardItem 
                                key={db.id} 
                                db={db} 
                                isSelected={selectedIds.has(db.id)} 
                                onClick={toggleDashboard} 
                            />
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-gray-50/50 dark:bg-gray-950/30 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => onSave(Array.from(selectedIds))}
                        className="px-8 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
