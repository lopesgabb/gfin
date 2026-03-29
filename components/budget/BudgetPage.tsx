import React, { useState, useMemo } from 'react';
import { useBudgetStore, useExpensesStore } from '../../stores';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { 
    Wallet, 
    Trash2, 
    Plus, 
    AlertTriangle, 
    TrendingUp, 
    Package 
} from 'lucide-react';
import { VALID_CATEGORIES } from '../../types';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Moradia": "🏠",
    "Alimentação": "🍔",
    "Transporte": "🚗",
    "Saúde": "🏥",
    "Lazer": "🎮",
    "Educação": "📚",
    "Investimentos": "📈",
    "Outros": "📦"
};

const BudgetPage: React.FC = () => {
    const { budgets, addBudget, deleteBudget } = useBudgetStore();
    const { expenses } = useExpensesStore();
    const [showModal, setShowModal] = useState(false);
    
    // Form State
    const [selectedCategory, setSelectedCategory] = useState("");
    const [limitValue, setLimitValue] = useState("");
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const currentMonthBudgets = useMemo(() => 
        budgets.filter(b => b.month === currentMonth),
    [budgets, currentMonth]);

    const spendingByCategory = useMemo(() => {
        const map: Record<string, number> = {};
        expenses.forEach(e => {
            if (e.date.startsWith(currentMonth)) {
                map[e.category] = (map[e.category] || 0) + e.value;
            }
        });
        return map;
    }, [expenses, currentMonth]);

    const availableCategories = VALID_CATEGORIES.filter(
        cat => !currentMonthBudgets.some(b => b.category === cat)
    );

    const handleAddBudget = () => {
        if (!selectedCategory || !limitValue) return;
        addBudget({
            category: selectedCategory,
            limit: Number(limitValue),
            month: currentMonth
        });
        setShowModal(false);
        setSelectedCategory("");
        setLimitValue("");
    };

    const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = Object.values(spendingByCategory).reduce((sum, val) => sum + val, 0);

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Meus Orçamentos</h1>
                    <p className="text-slate-500">Controle quanto você quer gastar em cada categoria</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <Plus className="w-4 h-4" />
                    Definir Limite
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardBody className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Orçamento Total</p>
                            <p className="text-2xl font-bold text-slate-800">
                                R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-emerald-100 p-3 rounded-full">
                            <Wallet className="w-6 h-6 text-emerald-600" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Gasto no Mês</p>
                            <p className="text-2xl font-bold text-slate-800">
                                R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Disponível</p>
                            <p className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                R$ {(totalBudget - totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full ${totalBudget - totalSpent >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {totalBudget - totalSpent >= 0 
                                ? <Wallet className="w-6 h-6 text-emerald-600" /> 
                                : <AlertTriangle className="w-6 h-6 text-red-500" />
                            }
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Budget Cards */}
            {currentMonthBudgets.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-12">
                        <div className="bg-slate-100 p-4 rounded-full inline-block mb-4">
                            <Wallet className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-slate-600 font-medium mb-1">Nenhum orçamento definido</h3>
                        <p className="text-slate-400 text-sm">
                            Clique em "Definir Limite" para começar a controlar seus gastos
                        </p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentMonthBudgets.map((budget) => {
                        const spent = spendingByCategory[budget.category] || 0;
                        const percentage = (spent / budget.limit) * 100;
                        const isOver = percentage > 100;
                        const isWarning = percentage >= 80 && percentage < 100;
                        
                        return (
                            <Card key={budget.id} className={isOver ? 'ring-2 ring-red-500' : ''}>
                                <CardBody>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{CATEGORY_ICONS[budget.category] || "📦"}</div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800">{budget.category}</h3>
                                                <p className="text-xs text-slate-400">
                                                    {isOver ? 'Limite excedido!' : isWarning ? 'Atenção ao limite' : 'Dentro do orçamento'}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => deleteBudget(budget.id)}
                                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">
                                                R$ {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                            <span className="text-slate-400">
                                                de R$ {budget.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <ProgressBar value={spent} max={budget.limit} size="md" />
                                        <p className="text-xs text-right text-slate-400">
                                            {percentage.toFixed(0)}% utilizado
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add Budget Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Novo Limite de Categoria"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Categoria
                        </label>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        >
                            <option value="">Selecione uma categoria</option>
                            {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Limite Mensal (R$)
                        </label>
                        <input 
                            type="number"
                            value={limitValue}
                            onChange={(e) => setLimitValue(e.target.value)}
                            placeholder="Ex: 500"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                            Cancelar
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleAddBudget}
                            disabled={!selectedCategory || !limitValue}
                            className="flex-1"
                        >
                            Salvar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BudgetPage;
