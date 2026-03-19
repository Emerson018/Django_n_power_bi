import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuditLogView = () => {
    const { api } = useAuth();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/audit-logs/');
            setLogs(response.data);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getActionBadgeColor = (action) => {
        switch (action) {
            case 'Inserção': return 'bg-green-100 text-green-700 border-green-200';
            case 'Edição': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Remoção': return 'bg-red-100 text-[#FF7877] border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium">Carregando histórico...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Histórico de Auditoria</h1>
                    <p className="text-sm text-gray-500 mt-1">Acompanhe todas as alterações realizadas no sistema.</p>
                </div>
                <button 
                    onClick={fetchLogs}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-primary"
                    title="Atualizar Histórico"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Data e Hora</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Usuário</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Ação</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">Alvo / Tipo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-700">
                                                {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-[10px] text-primary font-bold">
                                                {log.username?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{log.username || 'Sistema'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${getActionBadgeColor(log.action_type)}`}>
                                            {log.action_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-700">{log.object_name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{log.object_type}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum registro de auditoria encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogView;
