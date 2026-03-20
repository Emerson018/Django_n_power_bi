import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop com blur */}
            <div 
                className="absolute inset-0 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] shadow-2xl max-w-md w-full p-10 transform animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out border border-white/20">
                <div className="flex flex-col items-center text-center">
                    {/* Warning Icon Container */}
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner animate-bounce-subtle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
                        {title || 'Confirmar Exclusão'}
                    </h3>
                    
                    <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 px-4">
                        {message || 'Esta ação não poderá ser desfeita. Deseja realmente remover este item do sistema?'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 text-gray-400 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 text-sm uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-8 py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-xl shadow-red-200 hover:shadow-red-300 transition-all active:scale-95 text-sm uppercase tracking-widest"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            ` }} />
        </div>
    );
};

export default DeleteConfirmModal;
