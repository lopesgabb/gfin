import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/firebaseStores';
import { BrainCircuit, Loader2, ShieldCheck, TrendingUp, Wallet, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

const floatingAnimation = {
    initial: { y: 0 },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

const LoginPage: React.FC = () => {
    const { loginWithGoogle, loading, error } = useAuthStore();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-6 overflow-hidden">
            {/* Floating Background Elements */}
            <motion.div
                {...floatingAnimation}
                className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
            />
            <motion.div
                {...floatingAnimation}
                style={{ animationDelay: '2s' }}
                className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
            />

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="max-w-md w-full relative z-10"
            >
                {/* Logo */}
                <motion.div variants={fadeInUp} className="text-center mb-8">
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl border-2 border-slate-900 shadow-brutal mb-6"
                    >
                        <BrainCircuit className="w-12 h-12 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white font-display mb-2">GFin</h1>
                    <p className="text-slate-400 font-medium">Seu mentor financeiro pessoal</p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    variants={fadeInUp}
                    className="bg-white rounded-3xl border-2 border-slate-900 shadow-brutal p-8"
                >
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-2 font-display">
                        Bem-vindo! 👋
                    </h2>
                    <p className="text-slate-500 text-sm text-center mb-8">
                        Entre para organizar suas finanças e receber orientação de investimentos
                    </p>

                    {/* Features */}
                    <motion.div
                        variants={staggerContainer}
                        className="space-y-3 mb-8"
                    >
                        {[
                            { icon: Wallet, text: 'Controle de gastos e orçamento', color: 'emerald' },
                            { icon: TrendingUp, text: 'Calculadoras de investimentos', color: 'blue' },
                            { icon: ShieldCheck, text: 'Dados seguros e sincronizados', color: 'violet' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ x: 8 }}
                                className="flex items-center gap-3 text-sm text-slate-700 cursor-default"
                            >
                                <div className={`w-10 h-10 rounded-xl border-2 border-slate-900 bg-\${feature.color}-100 flex items-center justify-center shadow-brutal-sm`}>
                                    <feature.icon className={`w-5 h-5 text-\${feature.color}-600`} />
                                </div>
                                <span className="font-medium">{feature.text}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border-2 border-red-500 text-red-600 text-sm rounded-xl p-3 mb-4 text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Google Sign In Button */}
                    <motion.button
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loginWithGoogle}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-900 shadow-brutal hover:shadow-brutal-sm text-slate-900 font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Entrar com Google
                            </>
                        )}
                    </motion.button>

                    <p className="text-xs text-slate-400 text-center mt-6">
                        Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade
                    </p>
                </motion.div>

                {/* Footer */}
                <motion.p
                    variants={fadeInUp}
                    className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-8"
                >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Powered by Gemini 2.5 Pro + Firebase
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoginPage;