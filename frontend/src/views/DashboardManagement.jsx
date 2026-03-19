import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
        dashboard_type_ids: [],
        allowed_role_ids: [],
        allowed_user_ids: []
    });

    const [editingId, setEditingId] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/admin/dashboards/${editingId}/`, formData);
            } else {
                await api.post('/admin/dashboards/', formData);
            }
            setFormData({ name: '', public_url: '', dashboard_type_ids: [], allowed_role_ids: [], allowed_user_ids: [] });
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
            dashboard_type_ids: db.dashboard_type_ids || [],
            allowed_role_ids: db.allowed_role_ids || [],
            allowed_user_ids: db.allowed_user_ids || []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Deseja realmente excluir este dashboard?")) return;
        try {
            await api.delete(`/admin/dashboards/${id}/`);
            fetchData();
            fetchDashboards();
        } catch (error) {
            alert("Erro ao excluir dashboard");
        }
    };

    const toggleRole = (roleId) => {
        const current = [...formData.allowed_role_ids];
        const val = parseInt(roleId);
        const index = current.indexOf(val);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(val);
        }
        setFormData({ ...formData, allowed_role_ids: current });
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

    const toggleType = (typeId) => {
        const current = [...formData.dashboard_type_ids];
        const val = parseInt(typeId);
        const index = current.indexOf(val);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(val);
        }
        setFormData({ ...formData, dashboard_type_ids: current });
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Carregando dashboards...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Gestão de Dashboards</h2>

            {/* Formulário de Criação */}
            <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 transition-all ${editingId ? 'ring-2 ring-secondary/50' : ''}`}>
                <h3 className="text-lg font-semibold mb-4">
                    {editingId ? 'Editar Dashboard' : 'Adicionar Novo Dashboard'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" placeholder="Nome do Dashboard" required
                            className="px-4 py-2 border rounded-md focus:ring-secondary focus:border-secondary"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        <input 
                            type="url" placeholder="URL Pública (iFrame)" required
                            className="px-4 py-2 border rounded-md focus:ring-secondary focus:border-secondary"
                            value={formData.public_url}
                            onChange={e => setFormData({...formData, public_url: e.target.value})}
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Categorias (Selecione uma ou mais):</p>
                            <div className="flex flex-wrap gap-2">
                                {types.map(t => (
                                    <label key={t.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="rounded text-primary focus:ring-primary"
                                            checked={formData.dashboard_type_ids.includes(t.id)}
                                            onChange={() => toggleType(t.id)}
                                        />
                                        <span className="text-sm text-gray-700 font-medium">{t.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Permitir por Roles:</p>
                            <div className="flex flex-wrap gap-3">
                                {roles.map(role => (
                                    <label key={role.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="rounded text-secondary focus:ring-secondary"
                                            checked={formData.allowed_role_ids.includes(role.id)}
                                            onChange={() => toggleRole(role.id)}
                                        />
                                        <span className="text-sm text-gray-700 font-medium">{role.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Permitir Usuários Específicos:</p>
                            <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto p-2 border border-dashed border-gray-200 rounded-lg">
                                {users.filter(u => !u.is_staff).map(user => (
                                    <label key={user.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="rounded text-secondary focus:ring-secondary"
                                            checked={formData.allowed_user_ids.includes(user.id)}
                                            onChange={() => toggleUser(user.id)}
                                        />
                                        <span className="text-sm text-gray-700 font-medium">{user.username}</span>
                                    </label>
                                ))}
                                {users.filter(u => !u.is_staff).length === 0 && (
                                    <span className="text-xs text-gray-400 italic">Nenhum usuário comum cadastrado.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-8 rounded-md hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20">
                            {editingId ? 'Salvar Alterações' : 'Cadastrar Dashboard'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={() => {setEditingId(null); setFormData({name:'', public_url:'', dashboard_type_ids:[], allowed_role_ids:[], allowed_user_ids:[]})}}
                                className="bg-gray-100 text-gray-600 font-bold py-2 px-8 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Listagem */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dashboard</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissões (Roles)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dashboards.map((db) => (
                            <tr key={db.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{db.name}</div>
                                    <div className="text-xs text-gray-400 truncate max-w-xs">{db.public_url}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {db.dashboard_type_names?.length > 0 ? db.dashboard_type_names.map(name => (
                                            <span key={name} className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase">
                                                {name}
                                            </span>
                                        )) : (
                                            <span className="text-xs text-gray-400 italic">Sem Categoria</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {/* Roles */}
                                        {db.allowed_role_names?.map(name => (
                                            <span key={`role-${name}`} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase">
                                                {name}
                                            </span>
                                        ))}
                                        {/* Users */}
                                        {db.allowed_user_names?.map(name => (
                                            <span key={`user-${name}`} className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase">
                                                U: {name}
                                            </span>
                                        ))}
                                        {(!db.allowed_role_names?.length && !db.allowed_user_names?.length) && (
                                            <span className="text-xs text-gray-400 italic">Público (Todos)</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <button 
                                        onClick={() => handleEdit(db)}
                                        className="text-primary hover:text-primary/80 font-bold"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(db.id)}
                                        className="text-red-500 hover:text-red-600 font-bold"
                                    >
                                        Excluir
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

export default DashboardManagement;
