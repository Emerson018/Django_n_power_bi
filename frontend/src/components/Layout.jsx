import React, { useState, useEffect } from 'react';
import PowerBIViewer from './PowerBIViewer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider';
import { useFilter } from '../context/FilterContext';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import UserManagement from '../views/UserManagement';
import DashboardManagement from '../views/DashboardManagement';
import DashboardTypeManagement from '../views/DashboardTypeManagement';
import AllDashboardsView from '../views/AllDashboardsView';
import AuditLogView from '../views/AuditLogView';

function Sidebar({ isCollapsed }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className={`bg-primary text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50 transition-all duration-300 ease-in-out dark:bg-gray-800 ${isCollapsed ? 'w-0 -translate-x-full' : 'w-72 translate-x-0'}`}>
      <div className={`p-8 border-b border-white/10 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-bold tracking-tight">BI Portal</h1>
        <p className="text-xs text-secondary mt-1 font-medium uppercase tracking-widest">Enterprise Analytics</p>
      </div>

      <nav className={`flex-1 overflow-y-auto py-6 px-4 space-y-2 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
        <div className="px-4 mb-2">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Menu Principal</span>
        </div>
        <Link
          to="/"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            location.pathname === '/' ? 'bg-secondary text-white shadow-lg' : 'hover:bg-white/5 text-gray-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" />
          </svg>
          <span className="text-sm font-medium">Dashboards</span>
        </Link>

        {/* Menu Administrativo para Staff */}
        {user?.is_staff && (
          <div className="pt-6 space-y-2">
            <div className="px-4 mb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Administração</span>
            </div>
            <Link
              to="/admin/users"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === '/admin/users' ? 'bg-secondary text-white shadow-lg' : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <span className="text-sm font-medium">Usuários</span>
            </Link>
            <Link
              to="/admin/dashboards"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === '/admin/dashboards' ? 'bg-secondary text-white shadow-lg' : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12h11.25" />
              </svg>
              <span className="text-sm font-medium">Gestão de relatórios</span>
            </Link>
            
            <Link
              to="/admin/dashboard-types"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === '/admin/dashboard-types' ? 'bg-secondary text-white shadow-lg' : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.159 3.659A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <span className="text-sm font-medium">Categorias</span>
            </Link>

            <Link
              to="/admin/audit-logs"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === '/admin/audit-logs' ? 'bg-secondary text-white shadow-lg' : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Histórico</span>
            </Link>
          </div>
        )}
      </nav>
      
      <div className={`p-8 mt-auto border-t border-white/10 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
        {/* Logo Hospital Ernesto Dornelles */}
        <div className="flex justify-center">
          <img src="/logo_hed.png" alt="Hospital Ernesto Dornelles Logo" className="w-full max-w-[140px] opacity-80 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </aside>
  );
}

function Header({ title, subtitle, onToggleSidebar, isSidebarCollapsed }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { searchTerm, setSearchTerm, sortBy, setSortBy } = useFilter();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 z-40 sticky top-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 group dark:hover:bg-gray-800/50"
            title={isSidebarCollapsed ? "Expandir Menu" : "Recolher Menu"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 transition-transform duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <div className="flex flex-col min-w-[200px]">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight dark:text-white leading-tight">{title}</h2>
            {subtitle && (
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5 dark:text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Dashboard Filters - Only on Home */}
        {isHomePage && (
          <div className="flex items-center gap-4 flex-1 max-w-2xl animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Campo de Busca */}
            <div className="relative group flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-secondary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar dashboard..." 
                className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all font-bold text-sm text-gray-700 placeholder:text-gray-400 placeholder:font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Ordenação */}
            <div className="relative w-48">
              <select 
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all font-black text-[10px] uppercase tracking-widest text-gray-600 appearance-none cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest" className="dark:bg-gray-800">📅 Data</option>
                <option value="alphabetical" className="dark:bg-gray-800">🔤 Nome</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group shadow-sm active:scale-95"
          title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          )}
        </button>

        <button 
          onClick={logout}
          className="text-xs font-bold text-gray-400 hover:text-tertiary transition-all flex items-center gap-2 group dark:hover:text-red-400"
        >
          <span className="border-b border-transparent group-hover:border-tertiary">Encerrar Sessão</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 translate-y-[0.5px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>

        <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800"></div>

        <div className="flex items-center gap-3">
           <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-gray-800 leading-none dark:text-white">{user?.username}</span>
              <span className="text-[10px] text-secondary font-bold uppercase mt-1 tracking-tighter dark:text-secondary">
                {user?.is_staff ? 'Administrador' : 'Usuário'}
              </span>
           </div>
           <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10 shadow-inner dark:bg-primary/20 dark:border-primary/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
           </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout() {
  const { api, dashboards, fetchDashboards, isLoadingDashboards } = useAuth();
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Konami Code Handler (Hidden Access to Django Admin)
  useEffect(() => {
    let input = [];
    const secret = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

    const handler = (e) => {
      input.push(e.keyCode);
      input = input.slice(-10);
      if (input.join(',') === secret.join(',') && user?.is_staff) {
        window.open('http://localhost:8000/admin/', '_blank');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [user]);

  // Restaurar dashboard selecionado do localStorage ao carregar a lista
  useEffect(() => {
    if (dashboards.length > 0 && !selectedDashboard) {
      const savedId = localStorage.getItem('selectedDashboardId');
      if (savedId) {
        const db = dashboards.find(d => d.id.toString() === savedId);
        if (db) setSelectedDashboard(db);
      }
    }
  }, [dashboards, selectedDashboard]);

  const handleSelectDashboard = (db) => {
    setSelectedDashboard(db);
    if (db) {
      localStorage.setItem('selectedDashboardId', db.id.toString());
    } else {
      localStorage.removeItem('selectedDashboardId');
    }
  };

  const getHeaderInfo = () => {
    const path = location.pathname;
    let title = "Administração";
    let subtitle = null;

    if (path === '/') {
      title = "Portal de Dashboards";
    } else if (path === '/viewer') {
      title = selectedDashboard?.name || "Visualizador";
      subtitle = selectedDashboard?.category_name || "Sem Segmento";
    } else if (path === '/admin/users') {
      title = "Gestão de Usuários";
    } else if (path === '/admin/dashboards') {
      title = "Gestão de Relatórios";
    } else if (path === '/admin/dashboard-types') {
      title = "Gestão de Categorias";
    } else if (path === '/admin/audit-logs') {
      title = "Histórico de Auditoria";
    }

    return { title, subtitle };
  };

  const { title: headerTitle, subtitle: headerSubtitle } = getHeaderInfo();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900 antialiased selection:bg-secondary/30 dark:bg-gray-950 dark:text-white">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
      />

      <main className={`flex-1 min-h-screen bg-gray-50 flex flex-col items-center transition-all duration-300 ease-in-out dark:bg-gray-950 ${isSidebarCollapsed ? 'ml-0' : 'ml-72'}`}>
        <div className="w-full max-w-[1600px] flex flex-col min-h-screen">
          <Header 
            title={headerTitle}
            subtitle={headerSubtitle}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          
          <div className="p-10 flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<AllDashboardsView onSelectDashboard={handleSelectDashboard} />} />
              <Route path="/viewer" element={
                <PowerBIViewer 
                  embedUrl={selectedDashboard?.public_url} 
                  reportId={selectedDashboard?.id} 
                  isLoading={isLoadingDashboards}
                  isListEmpty={dashboards.length === 0}
                />
              } />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/dashboards" element={<DashboardManagement />} />
              <Route path="/admin/dashboard-types" element={<DashboardTypeManagement />} />
              <Route path="/admin/audit-logs" element={<AuditLogView />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}
