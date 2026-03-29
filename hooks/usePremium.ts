/**
 * usePremium Hook - Open Source Version
 * All features are unlocked by default.
 */
export const usePremium = () => {
    return {
        plan: 'free' as const,
        isPremium: false,
        canAddBudget: (_currentCount: number) => true,
        canAddGoal: (_currentCount: number) => true,
        canAccessCalculator: (_calculatorId: string) => true,
        hasChatHistory: true,
        canExportReports: true,
    };
};
