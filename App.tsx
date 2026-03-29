import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useUserStore, useExpensesStore, useBudgetStore, useGoalsStore } from './stores';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import ProfileQuiz from './components/profile/ProfileQuiz';
import BudgetPage from './components/budget/BudgetPage';
import GoalsPage from './components/goals/GoalsPage';
import CalculatorsPage from './components/calculators/CalculatorsPage';
import ImportPage from './components/import/ImportPage';

// Icons
import {
  LayoutDashboard,
  MessageSquareText,
  Wallet,
  Target,
  Calculator,
  BrainCircuit,
  Upload
} from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const { profile } = useUserStore();
  const { expenses, loadExpenses } = useExpensesStore();
  const { loadBudgets } = useBudgetStore();
  const { loadGoals } = useGoalsStore();

  const [showQuiz, setShowQuiz] = useState(!profile.quizCompleted);
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");

  useEffect(() => {
    loadExpenses();
    loadBudgets();
    loadGoals();
  }, []);

  // Show quiz for new users
  if (showQuiz) {
    return <ProfileQuiz onComplete={() => setShowQuiz(false)} />;
  }

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/import', icon: Upload, label: 'Importar' },
    { path: '/budget', icon: Wallet, label: 'Orçamento' },
    { path: '/goals', icon: Target, label: 'Metas' },
    { path: '/calculators', icon: Calculator, label: 'Calculadoras' },
    { path: '/chat', icon: MessageSquareText, label: 'Mentor IA' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header with Navigation */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-20">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="flex items-center gap-1">
              <BrainCircuit className="w-4 h-4" />
              Gemini 2.5
            </span>
          </div>
        </header>

        {/* Route Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  expenses={expenses}
                  selectedCategory={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                />
              }
            />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
            <Route
              path="/chat"
              element={
                <ChatInterface
                  profile={profile}
                  expenses={expenses}
                  selectedFilter={categoryFilter}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
