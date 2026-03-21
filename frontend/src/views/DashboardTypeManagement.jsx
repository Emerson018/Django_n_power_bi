import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const DashboardTypeManagement = () => {
    const { api, fetchDashboards } = useAuth();
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '',
        color: '#64748b'
    });

    const PREDEFINED_COLORS = [
        '#64748b', // Slate
        '#6366f1', // Indigo
        '#0d9488', // Teal
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#0ea5e9', // Sky
        '#8b5cf6', // Violet
        '#f43f5e', // Rose
    ];

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
            setFormData({ name: '', color: '#64748b' });
            setEditingId(null);
            fetchTypes();
            fetchDashboards(); // Atualiza a lista global para refletir cores/nomes no portal
        } catch (error) {
            alert("Erro ao salvar tipo de dashboard");
        }
    };

    const handleEdit = (type) => {
        setEditingId(type.id);
        setFormData({ 
            name: type.name,
            color: type.color || '#64748b'
        });
        // Scroll para o topo para facilitar a edição
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Abre o modal de confirmação
    const handleDeleteClick = (e, id) => {
        e.stopPropagation(); // Evita abrir o modal de edição ao clicar no botão de excluir
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
            fetchDashboards(); // Atualiza a lista global
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
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Nome */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-[#003B67]/80 uppercase tracking-widest ml-1 dark:text-gray-500">Nome da Categoria</label>
                            <input 
                                type="text" placeholder="Ex: Financeiro, Marketing, TI" required
                                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all bg-white font-medium text-gray-700 placeholder:text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-600"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        {/* Cores */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-[#003B67]/80 uppercase tracking-widest ml-1 dark:text-gray-500">Cor da Categoria</label>
                            <div className="flex flex-wrap gap-3 p-1">
                                {PREDEFINED_COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({...formData, color})}
                                        className={`w-10 h-10 rounded-full transition-all duration-300 relative ${formData.color === color ? 'ring-4 ring-offset-2 ring-secondary scale-110 shadow-lg' : 'hover:scale-110 hover:shadow-md'}`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    >
                                        {formData.color === color && (
                                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="bg-secondary text-white font-black py-4 px-12 rounded-2xl hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 active:scale-95 uppercase tracking-widest text-sm">
                            {editingId ? 'Atualizar' : 'Cadastrar'}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={() => {setEditingId(null); setFormData({name:'', color: '#64748b'})}}
                                className="bg-white text-gray-400 font-bold py-4 px-12 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 uppercase tracking-widest text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {types.map((type) => (
                    <div 
                        key={type.id} 
                        onClick={() => handleEdit(type)}
                        className="group relative bg-white p-8 rounded-[32px] border-2 border-transparent hover:border-secondary shadow-xl shadow-gray-200/40 cursor-pointer transition-all duration-500 hover:-translate-y-2 dark:bg-gray-800 dark:shadow-none dark:hover:border-secondary"
                    >
                        {/* Indicador de Cor Lateral */}
                        <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-r-full transition-all duration-500 group-hover:h-24"
                            style={{ backgroundColor: type.color || '#64748b' }}
                        ></div>

                        <div className="flex justify-between items-start mb-6">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12"
                                style={{ backgroundColor: `${type.color || '#64748b'}15`, color: type.color || '#64748b' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.159 3.659A2.25 2.25 0 009.568 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                </svg>
                            </div>
                            
                            <button 
                                type="button"
                                onClick={(e) => handleDeleteClick(e, type.id)}
                                className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all dark:hover:bg-red-900/20"
                                title="Excluir Categoria"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>

                        <h4 className="text-lg font-black text-gray-800 tracking-tight uppercase group-hover:text-secondary transition-colors dark:text-white">
                            {type.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Clique para editar
                        </p>
                    </div>
                ))}
                
                {types.length === 0 && (
                    <div className="col-span-full p-24 text-center bg-gray-50/30 rounded-[40px] border-4 border-dashed border-gray-100 dark:bg-gray-900/20 dark:border-gray-800">
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
