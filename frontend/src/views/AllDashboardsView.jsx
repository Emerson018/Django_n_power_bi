import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useFilter } from '../context/FilterContext';

const AllDashboardsView = ({ onSelectDashboard }) => {
    const { dashboards, isLoadingDashboards } = useAuth();
    const { searchTerm, sortBy } = useFilter(); // Consumindo do contexto global
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]); // Array de nomes de categorias selecionadas

    const handleAccess = (db) => {
        if (onSelectDashboard) {
            onSelectDashboard(db);
        }
        navigate('/viewer');
    };

    // Extrai categorias únicas presentes nos dashboards
    const availableCategories = useMemo(() => {
        const cats = dashboards.map(db => db.category_name).filter(Boolean);
        return [...new Set(cats)].sort();
    }, [dashboards]);

    const toggleCategory = (catName) => {
        if (selectedCategories.includes(catName)) {
            setSelectedCategories(selectedCategories.filter(c => c !== catName));
        } else {
            setSelectedCategories([...selectedCategories, catName]);
        }
    };

    // Lógica de filtragem e ordenação combinada
    const filteredAndSortedDashboards = useMemo(() => {
        let result = dashboards.filter(db => {
            const matchesSearch = db.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(db.category_name);
            return matchesSearch && matchesCategory;
        });

        if (sortBy === 'alphabetical') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        return result;
    }, [dashboards, searchTerm, sortBy, selectedCategories]);

    if (isLoadingDashboards) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div>
                <p className="mt-6 text-gray-400 font-black uppercase tracking-widest text-xs">Preparando sua vitrine...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
            {/* Filtro de Categorias (Chips) */}
            <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-[#003B67]/80 uppercase tracking-[0.2em] ml-1 dark:text-gray-400">Filtrar por Categoria:</span>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => setSelectedCategories([])}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategories.length === 0 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
                    >
                        Todas
                    </button>
                    {availableCategories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategories.includes(cat) ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 scale-105' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredAndSortedDashboards.map((db, index) => (
                    <div 
                        key={db.id} 
                        style={{ animationDelay: `${index * 50}ms` }}
                        className="bg-white rounded-[40px] shadow-xl shadow-gray-200/30 border border-gray-100/50 p-8 flex flex-col hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 dark:bg-gray-800 dark:border-gray-700 dark:shadow-none"
                    >
                        {/* Decorative background element */}
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex flex-wrap gap-2">
                                {db.category_name ? (
                                    <span className="px-3 py-1 bg-secondary/5 text-secondary text-[10px] font-black rounded-lg uppercase tracking-widest border border-secondary/10 shadow-sm">
                                        {db.category_name}
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-gray-100/50">
                                        Geral
                                    </span>
                                )}
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-primary mb-2 line-clamp-2 group-hover:text-primary/70 dark:text-white dark:group-hover:text-white/80 transition-colors relative z-10 tracking-tight leading-tight">
                            {db.name}
                        </h3>
                        {db.created_at && (
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mb-6 relative z-10 dark:text-gray-400">
                                Publicado em {new Date(db.created_at).toLocaleDateString('pt-BR')}
                            </span>
                        )}
                        
                        <div className="mt-auto pt-4 relative z-10">
                            <button 
                                onClick={() => handleAccess(db)}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-secondary/90 hover:shadow-2xl hover:shadow-secondary/30 active:scale-95 transition-all group/btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                                Acessar Relatório
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAndSortedDashboards.length === 0 && (
                <div className="bg-white rounded-[40px] border-4 border-dashed border-gray-100 p-24 text-center">
                    <div className="w-20 h-20 bg-white shadow-xl shadow-gray-200/40 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2">Sem Resultados</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">Não encontramos relatórios que correspondam aos filtros selecionados.</p>
                    <button 
                        onClick={() => {setSearchTerm(''); setSelectedCategories([]);}}
                        className="mt-8 text-xs font-black text-secondary uppercase tracking-widest hover:underline"
                    >
                        Resetar todos os filtros
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllDashboardsView;
