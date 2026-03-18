import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardManagement = () => {
    const { api, fetchDashboards } = useAuth();
    const [dashboards, setDashboards] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ 
        name: '', 
        public_url: '', 
        description: '',
        allowed_role_ids: [] 
    });

    const fetchData = async () => {
        try {
            const [dashRes, rolesRes] = await Promise.all([
                api.get('/admin/dashboards/'),
                api.get('/admin/roles/')
            ]);
            setDashboards(dashRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/dashboards/', formData);
            setFormData({ name: '', public_url: '', description: '', allowed_role_ids: [] });
            fetchData();
            fetchDashboards();
        } catch (error) {
            alert("Erro ao criar dashboard");
        }
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
        const index = current.indexOf(parseInt(roleId));
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(parseInt(roleId));
        }
        setFormData({ ...formData, allowed_role_ids: current });
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Carregando dashboards...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Gestão de Dashboards</h2>

            {/* Formulário de Criação */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold mb-4">Adicionar Novo Dashboard</h3>
                <form onSubmit={handleCreate} className="space-y-4">
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
                    </div>
                    
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Quem pode visualizar?</p>
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

                    <button type="submit" className="w-full md:w-auto bg-secondary text-white font-bold py-2 px-8 rounded-md hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20">
                        Cadastrar Dashboard
                    </button>
                </form>
            </div>

            {/* Listagem */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dashboard</th>
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
                                    <div className="flex flex-wrap gap-1">
                                        {db.allowed_role_names?.length > 0 ? db.allowed_role_names.map(name => (
                                            <span key={name} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase">
                                                {name}
                                            </span>
                                        )) : (
                                            <span className="text-xs text-gray-400 italic">Público (Todos)</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleDelete(db.id)}
                                        className="text-tertiary hover:text-tertiary/80 font-semibold"
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
