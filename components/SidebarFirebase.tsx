import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquareText,
    Wallet,
    Target,
    Calculator,
    BrainCircuit,
    LogOut,
    Sparkles,
    Upload,
    UserCircle
} from 'lucide-react';
import { useAuthStore, useFirebaseUserStore } from '../stores/firebaseStores';

const SidebarFirebase = () => {
    const { user, logout } = useAuthStore();
    const { profile } = useFirebaseUserStore();
    const navigate = useNavigate();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/import', icon: Upload, label: 'Importar Dados' },
        { path: '/budget', icon: Wallet, label: 'Meu Orçamento' },
        { path: '/goals', icon: Target, label: 'Metas Financeiras' },
        { path: '/calculators', icon: Calculator, label: 'Calculadoras IA' },
        { path: '/chat', icon: MessageSquareText, label: 'Mentor Financeiro' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 hidden lg:flex">
            {/* Brand */}
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
                    <BrainCircuit className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">GFin</span>
            </div>

            {/* Profile Summary */}
            <div className="px-6 mb-8">
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-3">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-emerald-500/30" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                <UserCircle className="w-6 h-6 text-slate-400" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider truncate">
                                {user?.displayName || 'Usuário'}
                            </p>
                            <p className="text-sm font-semibold text-white truncate">
                                Perfil {profile?.risk || 'Local'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                        <Sparkles className="w-3 h-3" />
                        Nuvem Ativada
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                                ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                                : 'hover:bg-slate-800 hover:text-white'}
            `}
                    >
                        <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group text-left"
                >
                    <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                    <span className="font-medium">Logout Cloud</span>
                </button>
            </div>
        </aside>
    );
};

export default SidebarFirebase;
