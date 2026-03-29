import React, { useMemo } from 'react';
import { Expense, VALID_CATEGORIES } from '../types';
import { useBudgetStore, useGoalsStore, useUserStore } from '../stores';
import { Card, CardHeader, CardBody } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Package,
  PiggyBank
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#f97316', '#64748b', '#14b8a6'
];

const Dashboard: React.FC<DashboardProps> = ({ expenses, selectedCategory, onCategoryChange }) => {
  const { profile } = useUserStore();
  const { budgets } = useBudgetStore();
  const { goals } = useGoalsStore();

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === 'Todas') return expenses;
    return expenses.filter(e => e.category === selectedCategory);
  }, [expenses, selectedCategory]);

  const totalSpent = useMemo(() => 
    filteredExpenses.reduce((sum, e) => sum + e.value, 0), 
    [filteredExpenses]
  );

  const stats = useMemo(() => {
    const categories = Array.from(new Set(expenses.map(e => e.category || 'Outros')));
    const byCategory = categories.map((cat, idx) => ({
      name: cat,
      value: expenses.filter(e => (e.category || 'Outros') === cat).reduce((sum, e) => sum + e.value, 0),
      color: COLORS[idx % COLORS.length]
    })).sort((a, b) => b.value - a.value);

    return { byCategory };
  }, [expenses]);

  const currentMonthGoals = goals.slice(0, 3);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-2xl">
              <TrendingDown className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total de Gastos</p>
              <h3 className="text-2xl font-bold text-slate-800">
                R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Renda Mensal</p>
              <h3 className="text-2xl font-bold text-slate-800">
                R$ {profile.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <PiggyBank className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Economizado</p>
              <h3 className="text-2xl font-bold text-slate-800">
                R$ {(profile.salary - totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-2xl">
              <Filter className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">Filtrar Categoria</p>
              <select 
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="Todas">Todas</option>
                {VALID_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
              Gastos por Categoria
            </h3>
          </CardHeader>
          <CardBody className="h-[350px]">
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byCategory} layout="vertical" margin={{ left: 30, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {stats.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <Package className="w-12 h-12 opacity-20" />
                <p>Nenhum dado importado ainda</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              Suas Metas
            </h3>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full uppercase">
              Ativas
            </span>
          </CardHeader>
          <CardBody className="space-y-6">
            {goals.length > 0 ? (
              goals.slice(0, 4).map(goal => {
                const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-2xl mr-2">{goal.icon}</span>
                        <span className="font-semibold text-slate-700">{goal.name}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{percent.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={goal.currentAmount} max={goal.targetAmount} size="lg" />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>R$ {goal.currentAmount.toLocaleString()}</span>
                      <span>R$ {goal.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 space-y-2">
                <Target className="w-12 h-12 opacity-20" />
                <p>Adicione metas para acompanhar</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
