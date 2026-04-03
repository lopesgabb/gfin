import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockStorageService = {
  getProfile: vi.fn(),
  saveProfile: vi.fn(),
  getBudgets: vi.fn(),
  saveBudget: vi.fn(),
  deleteBudget: vi.fn(),
  getGoals: vi.fn(),
  saveGoal: vi.fn(),
  updateGoal: vi.fn(),
  deleteGoal: vi.fn(),
  getExpenses: vi.fn(),
  saveExpenses: vi.fn(),
  clearExpenses: vi.fn(),
  getChatHistory: vi.fn(),
  saveChatHistory: vi.fn(),
  clearChatHistory: vi.fn()
};

vi.mock('../services/storage', () => ({
  StorageService: mockStorageService
}));

const defaultProfile = {
  salary: 5000,
  risk: 'Moderado' as const,
  quizCompleted: false,
  createdAt: '2026-01-01T00:00:00.000Z'
};

describe('local Zustand stores', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    mockStorageService.getProfile.mockReturnValue(defaultProfile);
    mockStorageService.getBudgets.mockReturnValue([]);
    mockStorageService.getGoals.mockReturnValue([]);
    mockStorageService.getExpenses.mockReturnValue([]);
    mockStorageService.getChatHistory.mockReturnValue([]);
    mockStorageService.saveBudget.mockImplementation((b) => [{ ...b, id: 'budget-1' }]);
    mockStorageService.deleteBudget.mockReturnValue([]);
    mockStorageService.saveGoal.mockImplementation((g) => [{ ...g, id: 'goal-1', createdAt: '2026-01-01' }]);
    mockStorageService.updateGoal.mockImplementation((_id, updates) => [{ id: 'goal-1', name: 'Meta', targetAmount: 1000, currentAmount: updates.currentAmount ?? 0, deadline: '2026-12-31', icon: '🎯', createdAt: '2026-01-01' }]);
    mockStorageService.deleteGoal.mockReturnValue([]);
    mockStorageService.saveExpenses.mockImplementation((expenses) =>
      expenses.map((e, i) => ({ ...e, id: `exp-${i}`, created_at: '2026-01-01T00:00:00.000Z' }))
    );
    mockStorageService.saveChatHistory.mockImplementation(() => undefined);
  });

  it('loads and updates user profile', async () => {
    const { useUserStore } = await import('./index');

    useUserStore.getState().loadProfile();
    expect(useUserStore.getState().profile).toEqual(defaultProfile);

    useUserStore.getState().updateProfile({ salary: 7000 });
    expect(mockStorageService.saveProfile).toHaveBeenCalledWith({
      ...defaultProfile,
      salary: 7000
    });
    expect(useUserStore.getState().profile.salary).toBe(7000);
  });

  it('completes quiz with selected risk profile', async () => {
    const { useUserStore } = await import('./index');

    useUserStore.getState().completeQuiz('Arrojado');

    expect(mockStorageService.saveProfile).toHaveBeenCalledWith({
      ...defaultProfile,
      risk: 'Arrojado',
      quizCompleted: true
    });
    expect(useUserStore.getState().profile.risk).toBe('Arrojado');
    expect(useUserStore.getState().profile.quizCompleted).toBe(true);
  });

  it('adds, updates, deletes and finds budgets', async () => {
    const { useBudgetStore } = await import('./index');

    useBudgetStore.getState().addBudget({ category: 'Moradia', month: '2026-01', limit: 1000 });
    expect(mockStorageService.saveBudget).toHaveBeenCalledWith({
      category: 'Moradia',
      month: '2026-01',
      limit: 1000
    });
    expect(useBudgetStore.getState().budgets).toHaveLength(1);

    mockStorageService.getBudgets.mockReturnValue([{ id: 'budget-1', category: 'Moradia', month: '2026-01', limit: 1500 }]);
    useBudgetStore.getState().updateBudget('budget-1', { limit: 1500 });
    expect(mockStorageService.saveBudget).toHaveBeenCalledWith({
      id: 'budget-1',
      category: 'Moradia',
      month: '2026-01',
      limit: 1500
    });
    expect(useBudgetStore.getState().getBudgetForCategory('Moradia', '2026-01')?.limit).toBe(1500);

    useBudgetStore.getState().deleteBudget('budget-1');
    expect(mockStorageService.deleteBudget).toHaveBeenCalledWith('budget-1');
  });

  it('adds, updates, deletes goals and increments amount', async () => {
    const { useGoalsStore } = await import('./index');

    useGoalsStore.getState().addGoal({
      name: 'Meta',
      targetAmount: 1000,
      currentAmount: 100,
      deadline: '2026-12-31',
      icon: '🎯'
    });
    expect(mockStorageService.saveGoal).toHaveBeenCalled();
    expect(useGoalsStore.getState().goals).toHaveLength(1);

    useGoalsStore.setState({
      goals: [{ id: 'goal-1', name: 'Meta', targetAmount: 1000, currentAmount: 100, deadline: '2026-12-31', icon: '🎯', createdAt: '2026-01-01' }]
    });
    useGoalsStore.getState().addToGoal('goal-1', 50);
    expect(mockStorageService.updateGoal).toHaveBeenCalledWith('goal-1', { currentAmount: 150 });

    useGoalsStore.getState().deleteGoal('goal-1');
    expect(mockStorageService.deleteGoal).toHaveBeenCalledWith('goal-1');
  });

  it('loads, adds and clears expenses', async () => {
    const { useExpensesStore } = await import('./index');

    mockStorageService.getExpenses.mockReturnValue([
      { id: 'exp-1', date: '2026-01-01', merchant: 'Loja', category: 'Compras', value: 10, source_file: 'f.csv', created_at: '2026-01-01' }
    ]);
    useExpensesStore.getState().loadExpenses();
    expect(useExpensesStore.getState().expenses).toHaveLength(1);

    useExpensesStore.getState().addExpenses([
      { date: '2026-01-02', merchant: 'Mercado', category: 'Alimentação', value: 20, source_file: 'g.csv' }
    ]);
    expect(mockStorageService.saveExpenses).toHaveBeenCalled();
    expect(useExpensesStore.getState().expenses).toHaveLength(1);

    useExpensesStore.getState().clearExpenses();
    expect(mockStorageService.clearExpenses).toHaveBeenCalled();
    expect(useExpensesStore.getState().expenses).toEqual([]);
  });

  it('loads, appends and clears chat history with timestamp', async () => {
    const { useChatStore } = await import('./index');

    const fixedIso = '2026-03-01T10:00:00.000Z';
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedIso));

    mockStorageService.getChatHistory.mockReturnValue([{ role: 'user', content: 'Oi', timestamp: '2026-03-01T09:00:00.000Z' }]);
    useChatStore.getState().loadHistory();
    expect(useChatStore.getState().history).toHaveLength(1);

    useChatStore.getState().addMessage({ role: 'model', content: 'Olá' });
    expect(mockStorageService.saveChatHistory).toHaveBeenCalledWith([
      { role: 'user', content: 'Oi', timestamp: '2026-03-01T09:00:00.000Z' },
      { role: 'model', content: 'Olá', timestamp: fixedIso }
    ]);

    useChatStore.getState().clearHistory();
    expect(mockStorageService.clearChatHistory).toHaveBeenCalled();
    expect(useChatStore.getState().history).toEqual([]);

    vi.useRealTimers();
  });
});
