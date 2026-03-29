import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
    useAuthStore,
    useFirebaseUserStore,
    useFirebaseExpensesStore,
    useFirebaseBudgetsStore,
    useFirebaseGoalsStore
} from './stores/firebaseStores';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import ProfileQuiz from './components/profile/ProfileQuiz';
import BudgetPage from './components/budget/BudgetPage';
import GoalsPage from './components/goals/GoalsPage';
import CalculatorsPage from './components/calculators/CalculatorsPage';
import ImportPage from './components/import/ImportPage';
import LoginPage from './components/auth/LoginPage';

// Icons
import {
    LayoutDashboard,
    MessageSquareText,
    Wallet,
    Target,
    Calculator,
    BrainCircuit,
    Upload,
    Loader2
} from 'lucide-react';

// Loading Screen
const LoadingScreen = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando GFin...</p>
        </div>
    </div>
);

// Main App Content (authenticated)
function AppContent() {
    const { user } = useAuthStore();
    const { profile, loadProfile, updateProfile } = useFirebaseUserStore();
    const { expenses, subscribeExpenses, cleanup: cleanupExpenses } = useFirebaseExpensesStore();
    const { budgets, subscribeBudgets, cleanup: cleanupBudgets } = useFirebaseBudgetsStore();
    const { goals, subscribeGoals, cleanup: cleanupGoals } = useFirebaseGoalsStore();

    const [showQuiz, setShowQuiz] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>("Todas");
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (user) {
            // Load user profile
            loadProfile(user.uid).then(() => {
                setDataLoaded(true);
            });

            // Subscribe to real-time data
            subscribeExpenses(user.uid);
            subscribeBudgets(user.uid);
            subscribeGoals(user.uid);

            return () => {
                cleanupExpenses();
                cleanupBudgets();
                cleanupGoals();
            };
        }
    }, [user]);

    useEffect(() => {
        if (profile && !profile.quizCompleted) {
            setShowQuiz(true);
        }
    }, [profile]);

    if (!dataLoaded || !profile) {
        return <LoadingScreen />;
    }

    // Show quiz for new users
    if (showQuiz) {
        return (
            <ProfileQuiz
                onComplete={() => {
                    if (user) {
                        updateProfile(user.uid, { quizCompleted: true });
                    }
                    setShowQuiz(false);
                }}
            />
        );
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

// App Router with Auth
export default function App() {
    const { user, loading, initialize, initialized } = useAuthStore();

    useEffect(() => {
        initialize();
    }, []);

    if (!initialized || loading) {
        return <LoadingScreen />;
    }

    return (
        <BrowserRouter>
            <Routes>
                {user ? (
                    <Route path="/*" element={<AppContent />} />
                ) : (
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}
