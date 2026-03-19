import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardTypeManagement = () => {
    const { api } = useAuth();
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ 
        name: ''
    });

    const fetchTypes = async () => {
        try {
            const res = await api.get('/admin/dashboard-types/');
            setTypes(res.data);
        } catch (error) {
            console.error("Erro ao buscar categorias", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/admin/dashboard-types/${editingId}/`, formData);
            } else {
                await api.post('/admin/dashboard-types/', formData);
            }
            setFormData({ name: '' });
            setEditingId(null);
            fetchTypes();
        } catch (error) {
            alert("Erro ao salvar tipo de dashboard");
        }
    };

    const handleEdit = (type) => {
        setEditingId(type.id);
        setFormData({ 
            name: type.name
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Deseja realmente excluir este tipo? Isso pode afetar dashboards vinculados.")) return;
        try {
            await api.delete(`/admin/dashboard-types/${id}/`);
            fetchTypes();
        } catch (error) {
            alert("Erro ao excluir tipo");
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando tipos...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-primary">Categorias de Dashboard</h2>

            {/* Formulário */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">
                    {editingId ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <input 
                            type="text" placeholder="Nome da Categoria (ex: Financeiro)" required
                            className="px-4 py-2 border rounded-md focus:ring-secondary focus:border-secondary transition-all"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-8 rounded-md hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
                            {editingId ? 'Atualizar' : 'Cadastrar'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={() => {setEditingId(null); setFormData({name:''})}}
                                className="bg-gray-100 text-gray-600 font-bold py-2 px-8 rounded-md hover:bg-gray-200 transition-all"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabela */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {types.map((type) => (
                            <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-gray-900">{type.name}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleEdit(type)}
                                        className="text-primary hover:text-primary/80 font-bold mr-4"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(type.id)}
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

export default DashboardTypeManagement;
