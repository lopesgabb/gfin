import { describe, expect, it } from 'vitest';
import { usePremium } from './usePremium';

describe('usePremium', () => {
  it('returns fully unlocked defaults in open-source mode', () => {
    const premium = usePremium();

    expect(premium.plan).toBe('free');
    expect(premium.isPremium).toBe(false);
    expect(premium.hasChatHistory).toBe(true);
    expect(premium.canExportReports).toBe(true);
    expect(premium.canAddBudget(0)).toBe(true);
    expect(premium.canAddBudget(999)).toBe(true);
    expect(premium.canAddGoal(0)).toBe(true);
    expect(premium.canAddGoal(999)).toBe(true);
    expect(premium.canAccessCalculator('compound')).toBe(true);
  });
});
