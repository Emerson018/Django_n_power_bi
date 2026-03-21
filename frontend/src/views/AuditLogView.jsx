import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="px-8 py-6 flex items-center justify-between">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Página {currentPage} de {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all dark:bg-gray-800 dark:border-gray-700 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                            totalPages > 7 && 
                            pageNum !== 1 && 
                            pageNum !== totalPages && 
                            Math.abs(pageNum - currentPage) > 1
                        ) {
                            if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-1 text-gray-300">...</span>;
                            return null;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                                    currentPage === pageNum
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 dark:bg-secondary'
                                    : 'text-gray-400 hover:bg-white hover:text-gray-600 dark:hover:bg-gray-800'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all dark:bg-gray-800 dark:border-gray-700 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const AuditLogView = () => {
    const { api } = useAuth();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados para Paginação
    const [pageSize, setPageSize] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const totalPages = Math.ceil(totalCount / pageSize);

    useEffect(() => {
        fetchLogs(1, pageSize);
    }, [pageSize]);

    const fetchLogs = async (page = 1, size = pageSize) => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/audit-logs/?page=${page}&page_size=${size}`);
            if (response.data.results) {
                setLogs(response.data.results);
                setTotalCount(response.data.count);
                setCurrentPage(page);
            } else {
                setLogs(response.data);
                setTotalCount(response.data.length);
            }
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getActionBadgeColor = (action) => {
        switch (action) {
            case 'Inserção': return 'bg-green-50 text-green-600 border-green-100 shadow-sm shadow-green-100/50';
            case 'Edição': return 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100/50';
            case 'Remoção': return 'bg-red-50 text-red-500 border-red-100 shadow-sm shadow-red-100/50';
            case 'Falha de Login': return 'bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-100/50';
            default: return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLogs(newPage, pageSize);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading && logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div>
                <p className="mt-6 text-gray-400 font-black uppercase tracking-widest text-xs">Acessando registros...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700 ease-out pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-4 dark:text-white">
                        <div className="w-2.5 h-10 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
                        Registros de Segurança
                    </h3>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                        Exibindo {logs.length} de {totalCount} registros
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        {[50, 100].map((size) => (
                            <button
                                key={size}
                                onClick={() => setPageSize(size)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                    pageSize === size 
                                    ? 'bg-secondary text-white shadow-lg shadow-secondary/30' 
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                }`}
                            >
                                {size} Itens
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => fetchLogs(currentPage, pageSize)}
                        className="p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all text-gray-400 hover:text-secondary shadow-sm hover:shadow-md active:scale-95 group dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500 dark:hover:text-secondary"
                        title="Atualizar Histórico"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-6 h-6 group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700 dark:shadow-none">
                {/* Paginação Superior */}
                <div className="bg-gray-50/30 border-b border-gray-50 dark:bg-gray-900/30 dark:border-gray-700">
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                        isLoading={isLoading} 
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Operador</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Evento</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] dark:text-gray-500">Objeto / Alvo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-800 tracking-tight dark:text-white">
                                                {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 dark:text-gray-500">
                                                {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xs text-primary font-black border border-gray-100 shadow-sm group-hover:scale-110 transition-transform dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400">
                                                {log.username?.charAt(0).toUpperCase() || 'S'}
                                            </div>
                                            <span className="text-sm font-black text-gray-700 tracking-tight dark:text-gray-200">{log.username || 'Sistema'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className={`px-3 py-1.5 text-[10px] font-black rounded-lg border uppercase tracking-widest ${getActionBadgeColor(log.action_type)}`}>
                                            {log.action_type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-800 tracking-tight leading-tight dark:text-white uppercase">{log.object_name}</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-70 italic dark:text-gray-400">{log.object_type}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="p-4 inline-block bg-gray-50 rounded-2xl mb-4">
                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                             </svg>
                                        </div>
                                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Silêncio na rede: Nenhum registro encontrado</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginação Inferior */}
                <div className="bg-gray-50/30 border-t border-gray-50 dark:bg-gray-900/30 dark:border-gray-700">
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                        isLoading={isLoading} 
                    />
                </div>
            </div>
        </div>
    );
};

export default AuditLogView;
