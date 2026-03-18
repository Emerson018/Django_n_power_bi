import React from 'react';

const DjangoAdminView = () => {
    // A URL do admin do Django (assumindo que o backend roda na porta 8000)
    const adminUrl = "http://127.0.0.1:8000/admin/";

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-primary/5 px-6 py-3 flex justify-between items-center border-b border-gray-100">
                <div>
                    <h2 className="text-lg font-bold text-primary">Painel Administrativo Nativo</h2>
                    <p className="text-xs text-gray-500 font-medium">Gestão completa de modelos e configurações do Django</p>
                </div>
                <a 
                    href={adminUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                    <span>Abrir em nova aba</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                </a>
            </div>
            
            <iframe 
                src={adminUrl} 
                title="Django Admin"
                className="w-full h-full border-none"
                style={{ minHeight: '600px' }}
            />
        </div>
    );
};

export default DjangoAdminView;
