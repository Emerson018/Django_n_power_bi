import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);
        try {
            await register({ username, password });
            navigate('/login');
        } catch (err) {
            setError('Erro ao criar conta. Tente outro usuário.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 flex items-center justify-center p-6 transition-colors duration-500 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="w-full max-w-[520px] z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-900 rounded-3xl shadow-xl mb-6 border border-gray-100 dark:border-gray-800 transition-transform hover:scale-105 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-secondary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v9m-4.406-1.547L18.5 20.375M19 7.5L10 4.5M19 7.5L19 4.5M19 7.5L21 7.5M5.25 10.5V19.5M5.25 10.5L12 10.5M5.25 10.5L3.25 10.5M12 10.5V19.5" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-primary dark:text-white tracking-tighter mb-2">Novo Acesso</h1>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em]">Crie sua conta no Portal BI</p>
                </div>

                <div className="bg-white dark:bg-gray-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] p-10 md:p-14 border border-gray-100/50 dark:border-white/5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-primary to-secondary opacity-80"></div>

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
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Usuário</label>
                            <input
                                type="text"
                                required
                                placeholder="Escolha um nome de usuário"
                                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all outline-none font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Senha</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all outline-none font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Confirmar</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all outline-none font-bold text-gray-700 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-secondary hover:bg-secondary/95 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-secondary/20 hover:shadow-secondary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>Criar Minha Conta</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-medium mb-4 italic">Já possui uma conta?</p>
                        <Link
                            to="/login"
                            className="text-[10px] font-black text-primary dark:text-white hover:opacity-80 uppercase tracking-[0.2em] transition-opacity"
                        >
                            Voltar para o Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
