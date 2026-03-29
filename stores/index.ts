import { create } from 'zustand';
import { StorageService } from '../services/storage';
import { UserProfile, Expense, Budget, Goal, ChatMessage } from '../types';

// === PROFILE STORE ===
interface UserState {
  profile: UserProfile;
  loadProfile: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeQuiz: (risk: 'Conservador' | 'Moderado' | 'Arrojado') => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: StorageService.getProfile(),
  loadProfile: () => set({ profile: StorageService.getProfile() }),
  updateProfile: (updates) => {
    const current = get().profile;
    const updated = { ...current, ...updates };
    StorageService.saveProfile(updated);
    set({ profile: updated });
  },
  completeQuiz: (risk) => {
    const current = get().profile;
    const updated = { ...current, risk, quizCompleted: true };
    StorageService.saveProfile(updated);
    set({ profile: updated });
  }
}));

// === BUDGET STORE ===
interface BudgetState {
  budgets: Budget[];
  loadBudgets: () => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetForCategory: (category: string, month: string) => Budget | undefined;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  loadBudgets: () => set({ budgets: StorageService.getBudgets() }),
  addBudget: (budget) => {
    const updated = StorageService.saveBudget(budget);
    set({ budgets: updated });
  },
  updateBudget: (id, updates) => {
    const current = get().budgets;
    const idx = current.findIndex(b => b.id === id);
    if (idx >= 0) {
      const updated = { ...current[idx], ...updates };
      StorageService.saveBudget(updated);
      set({ budgets: StorageService.getBudgets() });
    }
  },
  deleteBudget: (id) => {
    const updated = StorageService.deleteBudget(id);
    set({ budgets: updated });
  },
  getBudgetForCategory: (category, month) => 
    get().budgets.find(b => b.category === category && b.month === month)
}));

// === GOALS STORE ===
interface GoalsState {
  goals: Goal[];
  loadGoals: () => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addToGoal: (id: string, amount: number) => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  loadGoals: () => set({ goals: StorageService.getGoals() }),
  addGoal: (goal) => {
    const updated = StorageService.saveGoal(goal);
    set({ goals: updated });
  },
  updateGoal: (id, updates) => {
    const updated = StorageService.updateGoal(id, updates);
    set({ goals: updated });
  },
  deleteGoal: (id) => {
    const updated = StorageService.deleteGoal(id);
    set({ goals: updated });
  },
  addToGoal: (id, amount) => {
    const goal = get().goals.find(g => g.id === id);
    if (goal) {
      const updated = StorageService.updateGoal(id, {
        currentAmount: goal.currentAmount + amount
      });
      set({ goals: updated });
    }
  }
}));

// === EXPENSES STORE ===
interface ExpensesState {
  expenses: Expense[];
  loadExpenses: () => void;
  addExpenses: (expenses: Omit<Expense, 'id' | 'created_at'>[]) => void;
  clearExpenses: () => void;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  expenses: [],
  loadExpenses: () => set({ expenses: StorageService.getExpenses() }),
  addExpenses: (newExpenses) => {
    const updated = StorageService.saveExpenses(newExpenses);
    set({ expenses: updated });
  },
  clearExpenses: () => {
    StorageService.clearExpenses();
    set({ expenses: [] });
  }
}));

// === CHAT STORE ===
interface ChatState {
  history: ChatMessage[];
  loadHistory: () => void;
  addMessage: (message: ChatMessage) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  history: [],
  loadHistory: () => set({ history: StorageService.getChatHistory() }),
  addMessage: (message) => {
    const newHistory = [...get().history, { ...message, timestamp: new Date().toISOString() }];
    StorageService.saveChatHistory(newHistory);
    set({ history: newHistory });
  },
  clearHistory: () => {
    StorageService.clearChatHistory();
    set({ history: [] });
  }
}));
