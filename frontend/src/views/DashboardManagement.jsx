import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardManagement = () => {
    const { api } = useAuth();
    const [dashboards, setDashboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', public_url: '', description: '' });

    const fetchDashboards = async () => {
        try {
            const response = await api.get('/admin/dashboards/');
            setDashboards(response.data);
        } catch (error) {
            console.error("Erro ao buscar dashboards", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/dashboards/', formData);
            setFormData({ name: '', public_url: '', description: '' });
            fetchDashboards();
        } catch (error) {
            alert("Erro ao criar dashboard");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Deseja realmente excluir este dashboard?")) return;
        try {
            await api.delete(`/admin/dashboards/${id}/`);
            fetchDashboards();
        } catch (error) {
            alert("Erro ao excluir dashboard");
        }
    };

    useEffect(() => {
        fetchDashboards();
    }, []);

    if (loading) return <div className="p-8 text-center">Carregando dashboards...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Gestão de Dashboards</h2>

            {/* Formulário de Criação */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold mb-4">Adicionar Novo Dashboard</h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <button type="submit" className="bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors">
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dashboards.map((db) => (
                            <tr key={db.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{db.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{db.public_url}</td>
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
