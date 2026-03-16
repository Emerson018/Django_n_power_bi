import React, { useState } from 'react';
import PowerBIViewer from './PowerBIViewer';

const dashboards = [
  { id: 'geral', title: 'Visão Geral' },
  { id: 'freshservice', title: 'KPIs de Tickets (FreshService)' },
  { id: 'tasy', title: 'Gestão Hospitalar (Tasy)' },
];

function Sidebar({ selectedId, onSelect }) {
  return (
    <aside className="w-64 bg-primary h-screen fixed left-0 top-0 flex flex-col text-white shadow-xl z-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">BI Portal</h1>
        <p className="text-sm text-gray-300 mt-1">Inteligência Corporativa</p>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {dashboards.map((dashboard) => (
            <li key={dashboard.id}>
              <button
                onClick={() => onSelect(dashboard)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                  selectedId === dashboard.id
                    ? 'bg-secondary font-semibold text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {dashboard.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-center text-gray-400">© 2026 Corporativo</p>
      </div>
    </aside>
  );
}

function Header({ title }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 sticky top-0">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      
      <div className="flex items-center gap-4">
        {/* Placeholder for Alerts */}
        <button className="text-tertiary hover:bg-red-50 p-2 rounded-full transition-colors relative">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-tertiary rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
           <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
              U
           </div>
           <span className="text-sm font-medium text-gray-700">Usuário</span>
        </div>
      </div>
    </header>
  );
}

function PowerBIContainer() {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[600px]">
       <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">Relatório Power BI</h3>
          <p className="mt-1 text-sm text-gray-500">O iframe do relatório será injetado aqui pelo PowerBIEmbed.</p>
       </div>
    </div>
  );
}

export default function Layout() {
  const [selectedDashboard, setSelectedDashboard] = useState(dashboards[0]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar selectedId={selectedDashboard.id} onSelect={setSelectedDashboard} />
      
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={selectedDashboard.title} />
        
        <div className="flex-1 p-8">
           {/* Mock props for layout validation, these will be replaced with actual API data */}
           <PowerBIViewer 
             embedUrl="" 
             accessToken="" 
             reportId={selectedDashboard.id} 
           />
        </div>
      </main>
    </div>
  );
}
