import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Wallet, 
  Target, 
  Calculator, 
  Settings,
  BrainCircuit,
  LogOut,
  Sparkles,
  Upload
} from 'lucide-react';
import { useUserStore } from '../stores';

const Sidebar = () => {
  const { profile } = useUserStore();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/import', icon: Upload, label: 'Importar Dados' },
    { path: '/budget', icon: Wallet, label: 'Meu Orçamento' },
    { path: '/goals', icon: Target, label: 'Metas Financeiras' },
    { path: '/calculators', icon: Calculator, label: 'Calculadoras IA' },
    { path: '/chat', icon: MessageSquareText, label: 'Mentor Financeiro' },
  ];

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
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Usuário</p>
              <p className="text-sm font-semibold text-white">Investidor {profile.risk}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Sparkles className="w-3 h-3" />
            Recursos Premium Ativos
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
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group">
          <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          <span className="font-medium">Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
