import React from 'react';

export default function PowerBIViewer({ embedUrl, reportId, isLoading, isListEmpty }) {
  // 1. Estado de Carregamento Inicial (Buscando da API)
  if (isLoading) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[600px] w-full h-full text-center p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-secondary rounded-full animate-spin dark:border-gray-700 dark:border-t-secondary"></div>
        <h3 className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Carregando Dashboards...</h3>
      </div>
    );
  }

  // 2. Estado de Lista Vazia (Usuário sem permissão ou sem dados)
  if (isListEmpty) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[600px] w-full h-full text-center p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 dark:bg-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300 dark:text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Nenhum dashboard disponível</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto dark:text-gray-400">
          Não encontramos relatórios atribuídos ao seu perfil. Entre em contato com o administrador para solicitar acesso.
        </p>
      </div>
    );
  }

  // 3. Aguardando Seleção (Lista existe, mas nada selecionado ainda - fallback)
  if (!embedUrl) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[600px] w-full h-full text-center p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4 dark:bg-secondary/20">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
           </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Aguardando Seleção...</h3>
        <p className="mt-1 text-sm text-gray-400 max-w-xs dark:text-gray-500">
          Selecione um dashboard no menu lateral para visualizar os dados.
        </p>
      </div>
    );
  }

  return (
    /* 
      Container Wrapper: 
      - h-[600px] ou flex-1 para manter o tamanho
      - overflow-hidden é essencial para cortar o que sobrar do iframe
    */
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] w-full h-full overflow-hidden flex flex-col relative dark:bg-gray-800 dark:border-gray-700">
      
      {/* 
        Container Interno com Altura Calculada:
        - Definimos uma altura levemente menor que a do iframe (ou cortamos a sobra)
        - O iframe terá 100% + o tamanho da barra (aprox 36px-40px)
      */}
      <div className="w-full h-full overflow-hidden flex-1 relative">
        <iframe
          title={reportId}
          src={embedUrl}
          frameBorder="0"
          allowFullScreen={true}
          style={{
            width: '100%',
            height: 'calc(100% + 40px)', // Empurra a barra inferior para fora
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        ></iframe>
      </div>

    </div>
  );
}
