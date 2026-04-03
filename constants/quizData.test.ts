import { describe, expect, it } from 'vitest';
import { getProfileFromScore, PROFILE_DESCRIPTIONS, QUIZ_QUESTIONS } from './quizData';

describe('quizData', () => {
  it('has consistent quiz structure', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThan(0);
    for (const q of QUIZ_QUESTIONS) {
      expect(q.id).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(q.options).toHaveLength(3);
      q.options.forEach(option => {
        expect(option.points).toBeGreaterThanOrEqual(1);
        expect(option.points).toBeLessThanOrEqual(3);
      });
    }
  });

  it('maps low scores to Conservador', () => {
    expect(getProfileFromScore(0)).toBe('Conservador');
    expect(getProfileFromScore(9)).toBe('Conservador');
  });

  it('maps boundary 40% to Conservador and next value to Moderado', () => {
    const maxScore = QUIZ_QUESTIONS.length * 3; // 24
    const scoreAt40 = (40 / 100) * maxScore; // 9.6
    expect(getProfileFromScore(scoreAt40)).toBe('Conservador');
    expect(getProfileFromScore(scoreAt40 + 0.1)).toBe('Moderado');
  });

  it('maps boundary 70% to Moderado and above to Arrojado', () => {
    const maxScore = QUIZ_QUESTIONS.length * 3; // 24
    const scoreAt70 = (70 / 100) * maxScore; // 16.8
    expect(getProfileFromScore(scoreAt70)).toBe('Moderado');
    expect(getProfileFromScore(scoreAt70 + 0.1)).toBe('Arrojado');
  });

  it('contains coherent profile descriptions and allocations', () => {
    const keys = Object.keys(PROFILE_DESCRIPTIONS);
    expect(keys.sort()).toEqual(['Arrojado', 'Conservador', 'Moderado'].sort());

    for (const profile of Object.values(PROFILE_DESCRIPTIONS)) {
      expect(profile.title).toBeTruthy();
      expect(profile.description).toBeTruthy();
      expect(profile.recommendations.length).toBeGreaterThan(0);

      const allocationTotal =
        profile.allocation.rendaFixa +
        profile.allocation.rendaVariavel +
        profile.allocation.reserva;
      expect(allocationTotal).toBe(100);
    }
  });
});
