import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const DashboardManagement = () => {
    const { api, fetchDashboards } = useAuth();
    const [dashboards, setDashboards] = useState([]);
    const [roles, setRoles] = useState([]);
    const [types, setTypes] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ 
        name: '', 
        public_url: '', 
        category_id: '',
        allowed_user_ids: []
    });

    const [editingId, setEditingId] = useState(null);
    
    // Estados para o Modal de Exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const fetchData = async () => {
        try {
            const [dashRes, rolesRes, typesRes, usersRes] = await Promise.all([
                api.get('/admin/dashboards/'),
                api.get('/admin/roles/'),
                api.get('/admin/dashboard-types/'),
                api.get('/admin/users/')
            ]);
            setDashboards(dashRes.data);
            setRoles(rolesRes.data);
            setTypes(typesRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        } finally {
            setLoading(false);
        }
    };

    // Cores para os avatares baseados no nome
    const getAvatarColor = (name) => {
        const colors = [
            'bg-blue-100 text-blue-600',
            'bg-green-100 text-green-600',
            'bg-purple-100 text-purple-600',
            'bg-orange-100 text-orange-600',
            'bg-pink-100 text-pink-600',
            'bg-cyan-100 text-cyan-600'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Filtro de usuários comuns (não superusuário e sem role Admin)
    const commonUsers = users.filter(u => !u.is_superuser && !u.role_names?.includes('Admin'));
    
    // Lógica do Master Checkbox
    const isAllSelected = commonUsers.length > 0 && commonUsers.every(u => formData.allowed_user_ids.includes(u.id));

    const handleSelectAll = (checked) => {
        if (checked) {
            setFormData({ ...formData, allowed_user_ids: commonUsers.map(u => u.id) });
        } else {
            setFormData({ ...formData, allowed_user_ids: [] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                category_id: formData.category_id || null,
                allowed_role_ids: [] // Removendo roles do envio
            };

            if (editingId) {
                await api.put(`/admin/dashboards/${editingId}/`, dataToSubmit);
            } else {
                await api.post('/admin/dashboards/', dataToSubmit);
            }
            setFormData({ name: '', public_url: '', category_id: '', allowed_user_ids: [] });
            setEditingId(null);
            fetchData();
            fetchDashboards();
        } catch (error) {
            alert("Erro ao salvar dashboard");
        }
    };

    const handleEdit = (db) => {
        setEditingId(db.id);
        setFormData({
            name: db.name,
            public_url: db.public_url,
            category_id: db.category_id || '',
            allowed_user_ids: db.allowed_user_ids || []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Abre o modal de confirmação
    const handleDeleteClick = (e, id) => {
        e.stopPropagation(); // Evita disparar o handleEdit da linha
        setIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Executa a exclusão de fato
    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        
        try {
            await api.delete(`/admin/dashboards/${idToDelete}/`);
            setIsDeleteModalOpen(false);
            setIdToDelete(null);
            fetchData();
            fetchDashboards();
        } catch (error) {
            console.error("Erro ao excluir dashboard:", error);
            alert("Erro ao excluir dashboard");
        }
    };

    const toggleUser = (userId) => {
        const current = [...formData.allowed_user_ids];
        const val = parseInt(userId);
        const index = current.indexOf(val);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(val);
        }
        setFormData({ ...formData, allowed_user_ids: current });
    };

    const renderUserStack = (userNames) => {
        if (!userNames || userNames.length === 0) {
            return (
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.15em] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2 italic">
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    Público (Todos)
                </span>
            );
        }

        const limit = 3;
        const displayUsers = userNames.slice(0, limit);
        const remaining = userNames.length - limit;

        return (
            <div className="flex -space-x-3 items-center ml-2">
                {displayUsers.map((name, i) => (
                    <div 
                        key={i} 
                        className={`w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[11px] font-black uppercase ring-1 ring-gray-100/10 transition-transform group-hover:translate-y-[-2px] ${getAvatarColor(name)}`}
                        style={{ zIndex: limit - i }}
                        title={name}
                    >
                        {name.charAt(0)}
                    </div>
                ))}
                {remaining > 0 && (
                    <div 
                        className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:translate-y-[-2px] transition-transform"
                        style={{ zIndex: 0 }}
                    >
                        +{remaining}
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium tracking-widest uppercase text-xs">Acessando central de dados...</div>;

    return (
        <div className="space-y-10">

            {/* Formulário de Criação/Edição */}
            <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/40 border border-gray-100/50 dark:bg-gray-800 dark:border-gray-700 dark:shadow-none">
                <h3 className="text-xl font-bold mb-10 text-gray-800 flex items-center gap-4 dark:text-white">
                    <div className="w-2.5 h-10 bg-secondary rounded-full shadow-lg shadow-secondary/20"></div>
                    {editingId ? 'Editar Dashboard' : 'Adicionar Novo Dashboard'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#003B67]/80 uppercase tracking-widest ml-1 dark:text-gray-500">Título dashboard</label>
                            <input 
                                type="text" placeholder="Ex: Dashboard de Vendas Q1" required
                                className="w-full px-8 py-5 border border-gray-300 rounded-2xl focus:ring-8 focus:ring-secondary/5 focus:border-secondary transition-all bg-gray-50/30 font-bold text-gray-700 placeholder:text-gray-500 placeholder:font-medium dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-700"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#003B67]/80 uppercase tracking-widest ml-1 dark:text-gray-500">Link Dashboard</label>
                            <input 
                                type="url" placeholder="https://app.powerbi.com/..." required
                                className="w-full px-8 py-5 border border-gray-300 rounded-2xl focus:ring-8 focus:ring-secondary/5 focus:border-secondary transition-all bg-gray-50/30 font-bold text-gray-700 placeholder:text-gray-500 placeholder:font-medium dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-700"
                                value={formData.public_url}
                                onChange={e => setFormData({...formData, public_url: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#003B67]/80 uppercase tracking-widest ml-1 dark:text-gray-500">Categoria</label>
                        <div className="relative">
                            <select 
                                required
                                className="w-full px-8 py-5 border border-gray-300 rounded-2xl focus:ring-8 focus:ring-secondary/5 focus:border-secondary transition-all bg-gray-50/30 font-bold text-gray-700 appearance-none cursor-pointer dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                value={formData.category_id}
                                onChange={e => setFormData({...formData, category_id: e.target.value})}
                            >
                                <option value="" className="font-medium text-gray-500 dark:bg-gray-900">Vincular a uma categoria...</option>
                                {types.map(t => (
                                    <option key={t.id} value={t.id} className="font-bold dark:bg-gray-900 text-gray-700 dark:text-gray-200">{t.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-[#003B67]/80 uppercase tracking-widest ml-1 dark:text-gray-500">Controle de Privilégios</label>
                        <div className="p-10 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-300 dark:bg-gray-900/50 dark:border-gray-700">
                            <div className="mb-8 flex items-center justify-between border-b border-gray-300/40 pb-8">
                                <label className="flex items-center gap-5 cursor-pointer group">
                                    <div className="relative">
                                        <input 
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={isAllSelected}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                        <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-secondary transition-all duration-500 shadow-inner"></div>
                                        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 peer-checked:left-8 shadow-md"></div>
                                    </div>
                                    <span className="text-[11px] font-black uppercase text-gray-600 peer-checked:text-secondary tracking-[0.25em] transition-colors dark:text-gray-500">Liberar para todos usuários</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {commonUsers.map(user => (
                                    <label key={user.id} className="flex items-center gap-4 p-5 rounded-2xl bg-transparent hover:bg-white transition-all cursor-pointer border-2 border-transparent hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40 group dark:hover:bg-gray-800 dark:hover:border-gray-700">
                                        <div className="relative flex items-center justify-center">
                                            <input 
                                                type="checkbox"
                                                className="peer w-6 h-6 rounded-lg border-2 border-gray-300 text-secondary focus:ring-0 transition-all checked:border-secondary"
                                                checked={formData.allowed_user_ids.includes(user.id)}
                                                onChange={() => toggleUser(user.id)}
                                            />
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-widest dark:text-gray-400 dark:group-hover:text-white">{user.username}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-5 pt-8">
                        <button type="submit" className="bg-secondary text-white font-black py-5 px-14 rounded-2xl hover:bg-secondary/90 transition-all shadow-2xl shadow-secondary/30 active:scale-95 uppercase tracking-widest text-sm">
                            {editingId ? 'Salvar Alterações' : 'Publicar Dashboard'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={() => {setEditingId(null); setFormData({name: '', public_url: '', category_id: '', allowed_user_ids: []})}}
                                className="bg-white text-gray-400 font-bold py-5 px-14 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 uppercase tracking-widest text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500"
                            >
                                Descartar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista de Relatórios */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-4 dark:text-white">
                    <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
                    Relatórios Cadastrados
                </h3>
                <div className="bg-white shadow-2xl shadow-gray-200/50 border border-gray-100 rounded-[40px] overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-10 py-6 text-left text-[11px] font-black text-gray-700 uppercase tracking-[0.25em] dark:text-gray-500">Dashboard</th>
                                <th className="px-10 py-6 text-left text-[11px] font-black text-gray-700 uppercase tracking-[0.25em] dark:text-gray-500">Categoria</th>
                                <th className="px-10 py-6 text-left text-[11px] font-black text-gray-700 uppercase tracking-[0.25em] dark:text-gray-500">Permissões</th>
                                <th className="px-10 py-6 text-right text-[11px] font-black text-gray-700 uppercase tracking-[0.25em] dark:text-gray-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50 dark:bg-gray-800 dark:divide-gray-700">
                            {dashboards.map((db) => (
                                <tr 
                                    key={db.id} 
                                    onClick={() => handleEdit(db)}
                                    className="hover:bg-gray-50/40 transition-all group cursor-pointer dark:hover:bg-gray-900/40"
                                >
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        <div className="text-base font-black text-gray-800 tracking-tight group-hover:text-primary transition-colors dark:text-white dark:group-hover:text-white/80">{db.name}</div>
                                        {db.created_at && (
                                            <div className="text-[10px] text-gray-400 truncate max-w-xs mt-2 font-medium uppercase tracking-widest dark:text-gray-500">
                                                Criado em {new Date(db.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        {db.category_name ? (
                                            <span 
                                                className="px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border shadow-sm"
                                                style={{ 
                                                    backgroundColor: `${db.category_color || '#64748b'}15`,
                                                    color: db.category_color || '#64748b',
                                                    borderColor: `${db.category_color || '#64748b'}25`
                                                }}
                                            >
                                                {db.category_name}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-gray-200 font-black uppercase tracking-widest italic opacity-50">Sem Segmento</span>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        {renderUserStack(db.allowed_user_names)}
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap text-right text-[11px] font-black space-x-8">
                                        <button 
                                            type="button"
                                            onClick={(e) => handleDeleteClick(e, db.id)}
                                            className="text-red-400 hover:text-red-600 transition-all uppercase tracking-[0.2em]"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {dashboards.length === 0 && (
                    <div className="p-40 text-center bg-gray-50/20">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-gray-200/50 flex items-center justify-center mx-auto mb-8 text-gray-100">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" />
                             </svg>
                        </div>
                        <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Vault Vazio</p>
                    </div>
                )}
                </div>
            </div>

            {/* Modal de Confirmação customizado */}
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Arquivar Dashboard?"
                message="Esta ação irá remover o acesso de todos os colaboradores a este relatório. O histórico de logs será mantido para auditoria."
            />
        </div>
    );
};

export default DashboardManagement;
