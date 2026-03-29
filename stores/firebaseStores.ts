import { create } from 'zustand';
import { 
    auth, 
    db, 
    signInWithGoogle, 
    signOut, 
    getUserProfile, 
    saveUserProfile,
    subscribeToExpenses,
    subscribeToBudgets,
    subscribeToGoals,
    saveExpense,
    deleteExpense,
    saveBudget as fbSaveBudget,
    deleteBudget as fbDeleteBudget,
    saveGoal as fbSaveGoal,
    deleteGoal as fbDeleteGoal
} from '../services/firebase';
import { User } from 'firebase/auth';
import { UserProfile, Expense, Budget, Goal } from '../types';

// === AUTH STORE ===
interface AuthState {
    user: User | null;
    loading: boolean;
    initialized: boolean;
    initialize: () => void;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    initialized: false,
    initialize: () => {
        auth.onAuthStateChanged((user) => {
            set({ user, loading: false, initialized: true });
        });
    },
    login: async () => {
        set({ loading: true });
        const { error } = await signInWithGoogle();
        if (error) {
            console.error("Login bias error:", error);
            set({ loading: false });
        }
    },
    logout: async () => {
        set({ loading: true });
        await signOut();
        set({ user: null, loading: false });
    }
}));

// === USER PROFILE STORE ===
interface FirebaseUserStore {
    profile: UserProfile | null;
    loading: boolean;
    loadProfile: (uid: string) => Promise<void>;
    updateProfile: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
}

export const useFirebaseUserStore = create<FirebaseUserStore>((set, get) => ({
    profile: null,
    loading: false,
    loadProfile: async (uid) => {
        set({ loading: true });
        const { data, error } = await getUserProfile(uid);
        if (data) {
            set({ profile: data as UserProfile, loading: false });
        } else {
            // New user profile
            const newProfile: UserProfile = {
                salary: 5000,
                risk: 'Moderado',
                quizCompleted: false,
                createdAt: new Date().toISOString()
            };
            await saveUserProfile(uid, newProfile);
            set({ profile: newProfile, loading: false });
        }
    },
    updateProfile: async (uid, updates) => {
        const current = get().profile;
        if (current) {
            const updated = { ...current, ...updates };
            await saveUserProfile(uid, updated);
            set({ profile: updated });
        }
    }
}));

// === DATA STORES (REAL-TIME) ===

interface FirebaseExpensesStore {
    expenses: Expense[];
    unsubscribe: (() => void) | null;
    subscribeExpenses: (uid: string) => void;
    addExpense: (uid: string, expense: Omit<Expense, 'id'>) => Promise<void>;
    removeExpense: (uid: string, id: string) => Promise<void>;
    cleanup: () => void;
}

export const useFirebaseExpensesStore = create<FirebaseExpensesStore>((set, get) => ({
    expenses: [],
    unsubscribe: null,
    subscribeExpenses: (uid) => {
        const unsub = subscribeToExpenses(uid, (expenses) => {
            set({ expenses });
        });
        set({ unsubscribe: unsub });
    },
    addExpense: async (uid, exp) => {
        await saveExpense(uid, exp);
    },
    removeExpense: async (uid, id) => {
        await deleteExpense(uid, id);
    },
    cleanup: () => {
        const { unsubscribe } = get();
        if (unsubscribe) unsubscribe();
        set({ expenses: [], unsubscribe: null });
    }
}));

interface FirebaseBudgetsStore {
    budgets: Budget[];
    unsubscribe: (() => void) | null;
    subscribeBudgets: (uid: string) => void;
    addBudget: (uid: string, budget: Omit<Budget, 'id'>) => Promise<void>;
    removeBudget: (uid: string, id: string) => Promise<void>;
    cleanup: () => void;
}

export const useFirebaseBudgetsStore = create<FirebaseBudgetsStore>((set, get) => ({
    budgets: [],
    unsubscribe: null,
    subscribeBudgets: (uid) => {
        const unsub = subscribeToBudgets(uid, (budgets) => {
            set({ budgets });
        });
        set({ unsubscribe: unsub });
    },
    addBudget: async (uid, budget) => {
        await fbSaveBudget(uid, budget);
    },
    removeBudget: async (uid, id) => {
        await fbDeleteBudget(uid, id);
    },
    cleanup: () => {
        const { unsubscribe } = get();
        if (unsubscribe) unsubscribe();
        set({ budgets: [], unsubscribe: null });
    }
}));

interface FirebaseGoalsStore {
    goals: Goal[];
    unsubscribe: (() => void) | null;
    subscribeGoals: (uid: string) => void;
    addGoal: (uid: string, goal: Omit<Goal, 'id'>) => Promise<void>;
    updateGoal: (uid: string, id: string, updates: Partial<Goal>) => Promise<void>;
    removeGoal: (uid: string, id: string) => Promise<void>;
    cleanup: () => void;
}

export const useFirebaseGoalsStore = create<FirebaseGoalsStore>((set, get) => ({
    goals: [],
    unsubscribe: null,
    subscribeGoals: (uid) => {
        const unsub = subscribeToGoals(uid, (goals) => {
            set({ goals });
        });
        set({ unsubscribe: unsub });
    },
    addGoal: async (uid, goal) => {
        await fbSaveGoal(uid, goal);
    },
    updateGoal: async (uid, id, updates) => {
        const goal = get().goals.find(g => g.id === id);
        if (goal) {
            await fbSaveGoal(uid, { ...goal, ...updates, id });
        }
    },
    removeGoal: async (uid, id) => {
        await fbDeleteGoal(uid, id);
    },
    cleanup: () => {
        const { unsubscribe } = get();
        if (unsubscribe) unsubscribe();
        set({ goals: [], unsubscribe: null });
    }
}));
