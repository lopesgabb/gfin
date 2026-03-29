import React from 'react';
import { motion } from 'framer-motion';
import { useUserStore, useExpensesStore } from '../stores';
import { PROFILE_DESCRIPTIONS } from '../constants/quizData';

import {
  Trash2, BrainCircuit, User,
  Shield, Sparkles, RotateCcw, Zap
} from 'lucide-react';

const sidebarItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const Sidebar: React.FC = () => {
  const { profile, setProfile } = useUserStore();
  const { clearExpenses } = useExpensesStore();


  const profileInfo = PROFILE_DESCRIPTIONS[profile.risk];

  const handleClearData = () => {
    if (window.confirm("Tem certeza que deseja apagar todos os dados?")) {
      clearExpenses();
      window.location.reload();
    }
  };

  const handleRetakeQuiz = () => {
    if (window.confirm("Deseja refazer o quiz de perfil de investidor?")) {
      setProfile({ quizCompleted: false });
      window.location.reload();
    }
  };

  const riskColors = {
    Conservador: { bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500', text: 'text-blue-400' },
    Moderado: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500', text: 'text-amber-400' },
    Arrojado: { bg: 'from-red-500/20 to-rose-500/20', border: 'border-red-500', text: 'text-red-400' }
  };

  const colors = riskColors[profile.risk];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden md:flex w-80 bg-slate-950/90 backdrop-blur-2xl text-slate-100 flex-col h-full border-r-2 border-slate-800"
    >
      {/* Logo */}
      <div className="p-6 border-b-2 border-slate-800">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4"
        >
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-emerald-400 to-teal-500 p-3 rounded-2xl border-2 border-slate-900 shadow-brutal-emerald"
          >
            <BrainCircuit className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">GFin</h1>
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Open Source
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="p-6 space-y-6 flex-1 overflow-y-auto"
      >
        {/* User Profile Card */}
        <motion.div
          variants={sidebarItemVariants}
          className={`bg-gradient-to-br \${colors.bg} rounded-2xl p-5 border-2 \${colors.border}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-slate-900/50 \${colors.text}`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Seu Perfil</p>
              <p className="font-bold text-white text-lg flex items-center gap-2">
                {profileInfo.emoji} {profile.risk}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetakeQuiz}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Refazer quiz
          </motion.button>
        </motion.div>

        {/* User Settings */}
        <motion.div variants={sidebarItemVariants}>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            Configurações
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-2 font-medium">Renda Mensal (R$)</label>
              <input
                type="number"
                value={profile.salary}
                onChange={(e) => setProfile({ salary: Number(e.target.value) })}
                className="w-full bg-slate-900 border-2 border-slate-700 hover:border-emerald-500 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-2 font-medium">Perfil de Risco</label>
              <select
                value={profile.risk}
                onChange={(e) => setProfile({ risk: e.target.value as any })}
                className="w-full bg-slate-900 border-2 border-slate-700 hover:border-emerald-500 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="Conservador">🛡️ Conservador</option>
                <option value="Moderado">⚖️ Moderado</option>
                <option value="Arrojado">🚀 Arrojado</option>
              </select>
            </div>
          </div>
        </motion.div>



        {/* Model Info */}
        <motion.div
          variants={sidebarItemVariants}
          className="bg-slate-900/50 p-5 rounded-2xl border-2 border-slate-700"
        >
          <h3 className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Powered by
          </h3>
          <div className="space-y-3 text-xs text-slate-300 font-mono">
            {[
              { label: 'ETL/Import', value: 'Gemini 2.5 Pro' },
              { label: 'Chat/Mentor', value: 'Gemini 2.5 Pro' },
              { label: 'Search', value: 'Google Grounding' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-500">{item.label}</span>
                <span className="text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-lg">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Clear Data */}
      <div className="p-6 border-t-2 border-slate-800">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClearData}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 px-4 rounded-xl transition-colors text-sm font-bold border-2 border-red-500/30 hover:border-red-500"
        >
          <Trash2 className="w-4 h-4" />
          Resetar Dados
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;