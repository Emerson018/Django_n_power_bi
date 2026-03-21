import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const DashboardTypeManagement = () => {
    const { api } = useAuth();
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ 
        name: ''
    });

    // Estados para o Modal de Exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

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

    // Abre o modal de confirmação
    const handleDeleteClick = (id) => {
        setIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Executa a exclusão de fato
    const handleConfirmDelete = async () => {
        if (!idToDelete) return;

        try {
            await api.delete(`/admin/dashboard-types/${idToDelete}/`);
            setIsDeleteModalOpen(false);
            setIdToDelete(null);
            fetchTypes();
        } catch (error) {
            console.error("Erro ao excluir tipo:", error);
            alert("Erro ao excluir tipo");
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium italic">Carregando categorias...</div>;

    return (
        <div className="space-y-10">

            {/* Formulário */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:shadow-none">
                <h3 className="text-xl font-bold mb-8 text-gray-800 flex items-center gap-3 dark:text-white">
                    <div className="w-2.5 h-8 bg-secondary rounded-full"></div>
                    {editingId ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <label className="text-xs font-bold text-[#003B67]/80 uppercase tracking-widest ml-1 dark:text-gray-500">Nome da Categoria</label>
                        <input 
                            type="text" placeholder="Ex: Financeiro, Marketing, TI" required
                            className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all bg-white font-medium text-gray-700 placeholder:text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-600"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-secondary text-white font-black py-4 px-12 rounded-2xl hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 active:scale-95 uppercase tracking-widest text-sm">
                            {editingId ? 'Atualizar' : 'Cadastrar'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={() => {setEditingId(null); setFormData({name:''})}}
                                className="bg-white text-gray-400 font-bold py-4 px-12 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 uppercase tracking-widest text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabela */}
            <div className="bg-white shadow-xl shadow-gray-200/40 border border-gray-100 rounded-[32px] overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:shadow-none">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                    <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Nome da Categoria</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50 dark:bg-gray-800 dark:divide-gray-700">
                        {types.map((type) => (
                            <tr key={type.id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className="text-sm font-black text-gray-800 tracking-tight uppercase dark:text-white">{type.name}</span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-right text-xs font-black space-x-6">
                                    <button 
                                        type="button"
                                        onClick={() => handleEdit(type)}
                                        className="text-primary hover:text-primary/70 transition-all uppercase tracking-[0.15em]"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleDeleteClick(type.id)}
                                        className="text-red-400 hover:text-red-600 transition-all uppercase tracking-[0.15em]"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {types.length === 0 && (
                    <div className="p-24 text-center bg-gray-50/30">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nenhuma categoria cadastrada</p>
                    </div>
                )}
            </div>

            {/* Modal de Confirmação customizado */}
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Categoria"
                message="Deseja realmente excluir esta categoria? Isso pode afetar os relatórios que estão vinculados a ela."
            />
        </div>
    );
};

export default DashboardTypeManagement;
