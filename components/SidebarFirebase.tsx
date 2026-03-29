import React from 'react';
import { useAuthStore, useFirebaseUserStore } from '../stores/firebaseStores';
import { PROFILE_DESCRIPTIONS } from '../constants/quizData';

import {
    Trash2, BrainCircuit, User,
    Shield, Sparkles, RotateCcw, LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { profile, updateProfile } = useFirebaseUserStore();


    if (!profile) return null;

    const profileInfo = PROFILE_DESCRIPTIONS[profile.risk];

    const handleRetakeQuiz = () => {
        if (window.confirm("Deseja refazer o quiz de perfil de investidor?") && user) {
            updateProfile(user.uid, { quizCompleted: false });
            window.location.reload();
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Deseja sair da sua conta?")) {
            await logout();
        }
    };

    return (
        <aside className="hidden md:flex w-72 bg-slate-900 text-slate-100 flex-col h-full border-r border-slate-800 shadow-xl">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">GFin</h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Open Source</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* User Info */}
                {user && (
                    <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-3">
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full border-2 border-emerald-500"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user.displayName || 'Usuário'}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>
                )}

                {/* User Profile Card */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg \${profile.risk === 'Conservador' ? 'bg-blue-500/20 text-blue-400' :
                                profile.risk === 'Moderado' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Seu Perfil</p>
                            <p className="font-semibold text-white flex items-center gap-2">
                                {profileInfo.emoji} {profile.risk}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleRetakeQuiz}
                        className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Refazer quiz
                    </button>
                </div>

                {/* User Settings */}
                <div>
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Configurações
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Renda Mensal (R$)</label>
                            <input
                                type="number"
                                value={profile.salary}
                                onChange={(e) => user && updateProfile(user.uid, { salary: Number(e.target.value) })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Perfil de Risco</label>
                            <select
                                value={profile.risk}
                                onChange={(e) => user && updateProfile(user.uid, { risk: e.target.value as any })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                            >
                                <option value="Conservador">🛡️ Conservador</option>
                                <option value="Moderado">⚖️ Moderado</option>
                                <option value="Arrojado">🚀 Arrojado</option>
                            </select>
                        </div>
                    </div>
                </div>



                {/* Model Info */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <h3 className="text-xs font-semibold text-emerald-400 mb-2 uppercase flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Powered by
                    </h3>
                    <div className="space-y-2 text-xs text-slate-300 font-mono">
                        <div className="flex justify-between">
                            <span>Backend:</span>
                            <span className="text-emerald-300">Firebase</span>
                        </div>
                        <div className="flex justify-between">
                            <span>AI:</span>
                            <span className="text-emerald-300">Gemini 2.5 Pro</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Search:</span>
                            <span className="text-emerald-300">Google Grounding</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className="p-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;