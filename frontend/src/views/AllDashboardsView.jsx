import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AllDashboardsView = ({ onSelectDashboard }) => {
    const { dashboards, isLoadingDashboards } = useAuth();
    const navigate = useNavigate();

    const handleAccess = (db) => {
        if (onSelectDashboard) {
            onSelectDashboard(db);
        }
        navigate('/');
    };

    if (isLoadingDashboards) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium">Carregando sua vitrine...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Portal de Dashboards</h1>
                <p className="text-gray-500 mt-2">Explore todos os relatórios disponíveis no seu perfil corporativo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dashboards.map((db) => (
                    <div 
                        key={db.id} 
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group overflow-hidden relative"
                    >
                        {/* Decorative background element */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex flex-wrap gap-2">
                                {db.dashboard_type_names?.length > 0 ? (
                                    db.dashboard_type_names.map(type => (
                                        <span key={type} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-gray-100 shadow-sm">
                                            {type}
                                        </span>
                                    ))
                                ) : (
                                    <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-wider italic">
                                        Geral
                                    </span>
                                )}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-primary/80 transition-colors relative z-10">
                            {db.name}
                        </h3>
                        
                        <div className="mt-auto pt-6 flex flex-col gap-3 relative z-10">
                            <button 
                                onClick={() => handleAccess(db)}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-secondary/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.301 8.844 6.136 6.5 12 6.5c5.863 0 8.7 2.344 9.964 5.822a1.012 1.012 0 010 .644C20.699 15.156 17.863 17.5 12 17.5c-5.863 0-8.7-2.344-9.964-5.822z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Acessar Relatório
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {dashboards.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Nenhum dashboard encontrado</h3>
                    <p className="text-gray-500 mt-1 max-w-xs mx-auto">Você ainda não tem permissão para visualizar nenhum relatório. Entre em contato com o suporte.</p>
                </div>
            )}
        </div>
    );
};

export default AllDashboardsView;
