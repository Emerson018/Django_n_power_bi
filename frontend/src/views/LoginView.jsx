import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Usuário ou senha incorretos.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 flex items-center justify-center p-6 transition-colors duration-500 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-900 rounded-3xl shadow-xl mb-6 border border-gray-100 dark:border-gray-800 transition-transform hover:scale-105 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary dark:text-secondary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-primary dark:text-white tracking-tighter mb-2">BI Portal</h1>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em]">Enterprise Analytics Solution</p>
                </div>

                <div className="bg-white dark:bg-gray-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] p-10 md:p-14 border border-gray-100/50 dark:border-white/5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-80"></div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-xs font-bold rounded-r-xl animate-in slide-in-from-top-2 duration-300 uppercase tracking-wide">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}
                    
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Usuário</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: admin"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary dark:focus:border-secondary transition-all outline-none font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Senha</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25a3.75 3.75 0 117.5 0v3H8.25v-3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary dark:focus:border-secondary transition-all outline-none font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>Acessar Portal</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium mb-4 italic">Não possui acesso ao sistema?</p>
                        <Link
                            to="/register"
                            className="text-[10px] font-black text-secondary hover:text-secondary/80 uppercase tracking-[0.2em] transition-colors"
                        >
                            Solicitar nova conta
                        </Link>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-gray-400 dark:text-gray-600 text-[10px] uppercase font-bold tracking-widest">
                    &copy; {new Date().getFullYear()} BI Portal • Todos os direitos reservados
                </p>
            </div>
        </div>
    );
};

export default LoginView;
