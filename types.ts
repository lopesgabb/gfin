// === EXPENSE ===
export interface Expense {
  id: string;
  date: string;
  merchant: string;
  category: string;
  value: number;
  source_file: string;
  created_at: string;
}

// === USER PROFILE ===
export type RiskProfile = 'Conservador' | 'Moderado' | 'Arrojado';

export interface UserProfile {
  salary: number;
  risk: RiskProfile;
  quizCompleted: boolean;
  createdAt: string;
}

// === BUDGET ===
export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string; // Format: YYYY-MM
}

// === GOALS ===
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date
  icon: string;
  createdAt: string;
}

// === CHAT ===
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
}

// === CATEGORIES ===
export const VALID_CATEGORIES = [
  "Moradia",
  "Alimentação",
  "Restaurantes",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Assinaturas",
  "Compras",
  "Investimentos",
  "Outros"
] as const;

export type CategoryType = typeof VALID_CATEGORIES[number];

// === QUIZ QUESTIONS ===
export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    text: string; Part part, points: number; // Higher = more aggressive
  }[];
}

// === CALCULATOR TYPES ===
export interface CompoundInterestInput {
  principal: number;
  monthlyDeposit: number;
  annualRate: number;
  years: number;
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalDeposited: number;
  totalInterest: number;
  monthlyData: { month: number; balance: number; deposited: number }[];
}
