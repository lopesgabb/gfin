import { Expense, UserProfile, Budget, Goal } from '../types';

const STORAGE_KEYS = {
  EXPENSES: 'finbot_expenses',
  PROFILE: 'finbot_profile',
  BUDGETS: 'finbot_budgets',
  GOALS: 'finbot_goals',
  CHAT_HISTORY: 'finbot_chat_history',
};

// Helper to safely parse JSON from localStorage
const safeGet = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return fallback;
  }
};

const safeSet = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const StorageService = {
  // === EXPENSES ===
  getExpenses: (): Expense[] => safeGet(STORAGE_KEYS.EXPENSES, []),

  saveExpenses: (newExpenses: Omit<Expense, 'id' | 'created_at'>[]): Expense[] => {
    const current = StorageService.getExpenses();
    const toAdd = newExpenses.map(exp => ({
      ...exp,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }));
    const updated = [...current, ...toAdd];
    safeSet(STORAGE_KEYS.EXPENSES, updated);
    return updated;
  },

  clearExpenses: () => localStorage.removeItem(STORAGE_KEYS.EXPENSES),

  // === PROFILE ===
  getProfile: (): UserProfile => safeGet(STORAGE_KEYS.PROFILE, {
    salary: 5000,
    risk: 'Moderado',
    quizCompleted: false,
    createdAt: new Date().toISOString(),
  }),

  saveProfile: (profile: UserProfile) => safeSet(STORAGE_KEYS.PROFILE, profile),

  // === BUDGETS ===
  getBudgets: (): Budget[] => safeGet(STORAGE_KEYS.BUDGETS, []),

  saveBudget: (budget: Omit<Budget, 'id'>): Budget[] => {
    const current = StorageService.getBudgets();
    const existing = current.findIndex(b => b.category === budget.category && b.month === budget.month);
    
    if (existing >= 0) {
      current[existing] = { ...current[existing], ...budget };
    } else {
      current.push({ ...budget, id: crypto.randomUUID() });
    }
    
    safeSet(STORAGE_KEYS.BUDGETS, current);
    return current;
  },

  deleteBudget: (id: string): Budget[] => {
    const current = StorageService.getBudgets().filter(b => b.id !== id);
    safeSet(STORAGE_KEYS.BUDGETS, current);
    return current;
  },

  // === GOALS ===
  getGoals: (): Goal[] => safeGet(STORAGE_KEYS.GOALS, []),

  saveGoal: (goal: Omit<Goal, 'id' | 'createdAt'>): Goal[] => {
    const current = StorageService.getGoals();
    current.push({
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    safeSet(STORAGE_KEYS.GOALS, current);
    return current;
  },

  updateGoal: (id: string, updates: Partial<Goal>): Goal[] => {
    const current = StorageService.getGoals();
    const idx = current.findIndex(g => g.id === id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...updates };
    }
    safeSet(STORAGE_KEYS.GOALS, current);
    return current;
  },

  deleteGoal: (id: string): Goal[] => {
    const current = StorageService.getGoals().filter(g => g.id !== id);
    safeSet(STORAGE_KEYS.GOALS, current);
    return current;
  },

  // === CHAT HISTORY ===
  getChatHistory: () => safeGet(STORAGE_KEYS.CHAT_HISTORY, []),
  saveChatHistory: (history: unknown[]) => safeSet(STORAGE_KEYS.CHAT_HISTORY, history),
  clearChatHistory: () => localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY),

  // === CLEAR ALL ===
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};
