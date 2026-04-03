import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StorageService } from './storage';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns defaults when storage is empty', () => {
    expect(StorageService.getExpenses()).toEqual([]);
    expect(StorageService.getBudgets()).toEqual([]);
    expect(StorageService.getGoals()).toEqual([]);
    expect(StorageService.getChatHistory()).toEqual([]);

    const profile = StorageService.getProfile();
    expect(profile.salary).toBe(5000);
    expect(profile.risk).toBe('Moderado');
    expect(profile.quizCompleted).toBe(false);
    expect(Number.isNaN(Date.parse(profile.createdAt))).toBe(false);
  });

  it('returns fallback when stored JSON is invalid', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('finbot_expenses', '{bad json');

    const expenses = StorageService.getExpenses();

    expect(expenses).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('saves expenses with generated id and timestamp', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('exp-1');

    const updated = StorageService.saveExpenses([
      {
        date: '2026-01-01',
        merchant: 'Mercado',
        category: 'Alimentação',
        value: 100,
        source_file: 'file.csv'
      }
    ]);

    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe('exp-1');
    expect(updated[0].merchant).toBe('Mercado');
    expect(Number.isNaN(Date.parse(updated[0].created_at))).toBe(false);
  });

  it('updates an existing budget for same category and month', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('budget-1');

    StorageService.saveBudget({ category: 'Moradia', limit: 1000, month: '2026-01' });
    const second = StorageService.saveBudget({ category: 'Moradia', limit: 1500, month: '2026-01' });

    expect(second).toHaveLength(1);
    expect(second[0].id).toBe('budget-1');
    expect(second[0].limit).toBe(1500);
  });

  it('deletes a budget by id', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValueOnce('budget-1')
      .mockReturnValueOnce('budget-2');

    StorageService.saveBudget({ category: 'Moradia', limit: 1000, month: '2026-01' });
    StorageService.saveBudget({ category: 'Saúde', limit: 400, month: '2026-01' });

    const remaining = StorageService.deleteBudget('budget-1');

    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe('budget-2');
  });

  it('adds and updates goals correctly', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('goal-1');

    const saved = StorageService.saveGoal({
      name: 'Reserva',
      targetAmount: 10000,
      currentAmount: 1000,
      deadline: '2027-01-01',
      icon: '🎯'
    });

    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe('goal-1');

    const updated = StorageService.updateGoal('goal-1', { currentAmount: 2500 });
    expect(updated[0].currentAmount).toBe(2500);
  });

  it('persists and clears chat history', () => {
    const history = [{ role: 'user', content: 'Oi' }, { role: 'model', content: 'Olá' }];

    StorageService.saveChatHistory(history);
    expect(StorageService.getChatHistory()).toEqual(history);

    StorageService.clearChatHistory();
    expect(StorageService.getChatHistory()).toEqual([]);
  });

  it('clearAll removes all known keys', () => {
    StorageService.saveExpenses([
      {
        date: '2026-01-01',
        merchant: 'Loja',
        category: 'Compras',
        value: 200,
        source_file: 'import.csv'
      }
    ]);
    StorageService.saveProfile({
      salary: 6000,
      risk: 'Arrojado',
      quizCompleted: true,
      createdAt: new Date().toISOString()
    });
    StorageService.saveBudget({ category: 'Moradia', limit: 1200, month: '2026-01' });
    StorageService.saveGoal({
      name: 'Viagem',
      targetAmount: 3000,
      currentAmount: 300,
      deadline: '2026-12-01',
      icon: '✈️'
    });
    StorageService.saveChatHistory([{ role: 'user', content: 'Teste' }]);

    StorageService.clearAll();

    expect(localStorage.getItem('finbot_expenses')).toBeNull();
    expect(localStorage.getItem('finbot_profile')).toBeNull();
    expect(localStorage.getItem('finbot_budgets')).toBeNull();
    expect(localStorage.getItem('finbot_goals')).toBeNull();
    expect(localStorage.getItem('finbot_chat_history')).toBeNull();
  });
});
