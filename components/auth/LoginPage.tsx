import React, { useState } from 'react';
import { useAuthStore } from '../../stores/firebaseStores';
import { Button } from '../ui/Button';
import { BrainCircuit, LogIn, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { login, loading } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            await login();
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login com Google');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-500/20 mb-6 rotate-3">
                        <BrainCircuit className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">GFin</h1>
                    <p className="text-slate-400">Sua Gestão Financeira com Inteligência Artificial</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 text-center">Bem-vindo(a) de volta</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Button 
                            onClick={handleLogin} 
                            isLoading={loading}
                            variant="primary"
                            className="w-full py-4 text-base bg-emerald-500 hover:bg-emerald-600 border-none shadow-emerald-500/20"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-1" alt="Google" />
                            Entrar com Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900 px-2 text-slate-500">Ou use</span>
                            </div>
                        </div>

                        <Button 
                            variant="outline"
                            className="w-full py-4 text-base border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                            disabled
                        >
                            <Mail className="w-5 h-5" />
                            E-mail (Em breve)
                        </Button>
                    </div>

                    <p className="text-center text-xs text-slate-500 mt-8">
                        Ao entrar, você concorda com nossos <br />
                        <span className="text-emerald-500/80 cursor-pointer">Termos de Uso</span> e <span className="text-emerald-500/80 cursor-pointer">Privacidade</span>.
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-400">
                        Não quer usar nuvem agora? <br />
                        <span className="text-emerald-400 font-medium cursor-pointer">Use o Modo Local (PWA)</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
