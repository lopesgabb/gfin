import React, { useState, useMemo } from 'react';
import { Expense } from '../types';
import { GeminiService } from '../services/gemini';
import { useExpensesStore } from '../stores';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { UploadCloud, FileText, Loader2, DollarSign, TrendingUp, ShoppingBag, Filter, Calendar, Plus } from 'lucide-react';
import { Card, CardBody, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { AddExpenseModal } from './expenses/AddExpenseModal';

interface DashboardProps {
    expenses: Expense[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, selectedCategory, onCategoryChange }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<string>("Todos");
    const { addExpenses } = useExpensesStore();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsProcessing(true);
        setUploadStatus("Iniciando processamento...");

        let newExpensesBuffer: any[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setUploadStatus(`Processando \${file.name} (\${i + 1}/\${files.length})...`);

                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const result = reader.result as string;
                        const b64 = result.split(',')[1];
                        resolve(b64);
                    };
                    reader.onerror = error => reject(error);
                });

                const extractedData = await GeminiService.processInvoice(base64, file.type, file.name);
                newExpensesBuffer = [...newExpensesBuffer, ...extractedData];
            }

            if (newExpensesBuffer.length > 0) {
                addExpenses(newExpensesBuffer);
                setUploadStatus(`Sucesso! \${newExpensesBuffer.length} transações importadas.`);
            } else {
                setUploadStatus("Nenhuma transação identificada nos arquivos.");
            }
        } catch (error) {
            console.error(error);
            setUploadStatus("Erro ao processar arquivos via API.");
        } finally {
            setIsProcessing(false);
            event.target.value = '';
            setTimeout(() => setUploadStatus(""), 5000);
        }
    };

    // Available Months for Filter
    const availableMonths = useMemo(() => {
        const months = new Set(expenses.map(e => e.date.substring(0, 7)));
        const sortedMonths = Array.from(months).sort().reverse();
        return ["Todos", ...sortedMonths];
    }, [expenses]);

    // Month-filtered expenses (used for KPIs and category chart)
    const monthFilteredExpenses = useMemo(() => {
        if (selectedMonth === "Todos") return expenses;
        return expenses.filter(e => e.date.substring(0, 7) === selectedMonth);
    }, [expenses, selectedMonth]);

    // KPIs (now using month-filtered expenses)
    const totalSpent = useMemo(() => monthFilteredExpenses.reduce((acc, curr) => acc + curr.value, 0), [monthFilteredExpenses]);
    const maxExpense = useMemo(() => monthFilteredExpenses.length > 0 ? Math.max(...monthFilteredExpenses.map(e => e.value)) : 0, [monthFilteredExpenses]);
    const transactionCount = monthFilteredExpenses.length;

    // Chart Data Preparation (category chart now uses month-filtered expenses)
    const categoryData = useMemo(() => {
        const agg: Record<string, number> = {};
        monthFilteredExpenses.forEach(e => {
            const cat = e.category || "Outros";
            agg[cat] = (agg[cat] || 0) + e.value;
        });
        return Object.entries(agg)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [monthFilteredExpenses]);

    // Monthly evolution chart (uses all expenses to show trend)
    const monthlyData = useMemo(() => {
        const agg: Record<string, number> = {};
        expenses.forEach(e => {
            const month = e.date.substring(0, 7); // YYYY-MM
            agg[month] = (agg[month] || 0) + e.value;
        });
        return Object.entries(agg)
            .map(([month, value]) => ({
                name: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
                monthKey: month,
                value
            }))
            .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
    }, [expenses]);

    // Filter Logic for table (applies both month and category)
    const availableCategories = useMemo(() => {
        const cats = new Set(monthFilteredExpenses.map(e => e.category || "Outros"));
        return ["Todas", ...Array.from(cats).sort()];
    }, [monthFilteredExpenses]);

    const filteredExpenses = useMemo(() => {
        let filtered = monthFilteredExpenses;
        if (selectedCategory !== "Todas") {
            filtered = filtered.filter(e => (e.category || "Outros") === selectedCategory);
        }
        return filtered;
    }, [monthFilteredExpenses, selectedCategory]);

    const CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

    return (
        <div className="space-y-6 p-6">
            {/* Upload Section */}
            <Card>
                <CardBody>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-emerald-600" />
                            Importar Faturas
                        </h2>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowAddExpense(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar Despesa
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <label className="relative flex flex-col items-center justify-center w-full md:w-64 h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isProcessing ? (
                                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                ) : (
                                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                                )}
                                <p className="text-sm text-slate-500 font-medium">
                                    {isProcessing ? "Analisando..." : "Upload PDF/Imagem"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Múltiplos arquivos suportados</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="application/pdf,image/*"
                                multiple
                                disabled={isProcessing}
                                onChange={handleFileUpload}
                            />
                        </label>

                        <div className="flex-1 space-y-2">
                            <div className="text-sm text-slate-600">
                                <p>Faça upload de faturas em PDF ou Imagens.</p>
                                <p>O <strong>Gemini 2.5 Pro</strong> extrairá automaticamente:</p>
                            </div>
                            <div className="flex gap-2 text-xs flex-wrap">
                                {['Data', 'Estabelecimento', 'Valor', 'Categoria'].map(tag => (
                                    <span key={tag} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {uploadStatus && (
                                <div className={`text-sm font-medium mt-2 \${uploadStatus.includes("Erro") ? "text-red-500" : "text-emerald-600"}`}>
                                    {uploadStatus}
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>

            <AddExpenseModal
                isOpen={showAddExpense}
                onClose={() => setShowAddExpense(false)}
            />

            {expenses.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-12">
                        <div className="bg-slate-100 p-4 rounded-full inline-block mb-3">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-slate-600 font-medium">Nenhum dado financeiro</h3>
                        <p className="text-slate-400 text-sm mt-1">Faça upload de faturas para visualizar o dashboard.</p>
                    </CardBody>
                </Card>
            ) : (
                <>
                    {/* Month Filter */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">Período de Análise</p>
                                <p className="text-xs text-slate-400">Selecione o mês para filtrar os dados</p>
                            </div>
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2.5 outline-none shadow-sm font-medium min-w-[160px]"
                        >
                            {availableMonths.map(month => (
                                <option key={month} value={month}>
                                    {month === "Todos"
                                        ? "Todos os meses"
                                        : new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardBody className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Gasto Total</p>
                                    <p className="text-3xl font-bold text-slate-800 mt-1">
                                        R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="bg-emerald-100 p-3 rounded-full">
                                    <DollarSign className="w-6 h-6 text-emerald-600" />
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Maior Transação</p>
                                    <p className="text-3xl font-bold text-slate-800 mt-1">
                                        R$ {maxExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="bg-amber-100 p-3 rounded-full">
                                    <TrendingUp className="w-6 h-6 text-amber-600" />
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Transações</p>
                                    <p className="text-3xl font-bold text-slate-800 mt-1">
                                        {transactionCount}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="h-96">
                            <CardHeader className="pb-0">
                                <h3 className="text-slate-700 font-bold flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                                    Gastos por Categoria
                                </h3>
                            </CardHeader>
                            <CardBody className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={categoryData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                                        <RechartsTooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number) => [`R$ \${value.toFixed(2)}`, 'Valor']}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-\${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>

                        <Card className="h-96">
                            <CardHeader className="pb-0">
                                <h3 className="text-slate-700 font-bold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Evolução Mensal
                                </h3>
                            </CardHeader>
                            <CardBody className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$\${(v / 1000).toFixed(0)}k`} />
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number) => [`R$ \${value.toFixed(2)}`, 'Total']}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} fill="#6366f1" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Table */}
                    <Card>
                        <CardHeader className="bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="font-semibold text-slate-700">Histórico Detalhado</h3>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => onCategoryChange(e.target.value)}
                                    className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none"
                                >
                                    {availableCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </CardHeader>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Data</th>
                                        <th className="px-6 py-3 font-medium">Estabelecimento</th>
                                        <th className="px-6 py-3 font-medium">Categoria</th>
                                        <th className="px-6 py-3 font-medium text-right">Valor</th>
                                        <th className="px-6 py-3 font-medium">Fonte</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredExpenses.length > 0 ? (
                                        filteredExpenses.slice(0, 50).map((expense, idx) => (
                                            <tr key={expense.id || idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-3 font-mono text-slate-600">{expense.date}</td>
                                                <td className="px-6 py-3 font-medium text-slate-800">{expense.merchant}</td>
                                                <td className="px-6 py-3 text-slate-600">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                        {expense.category || "Outros"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-right font-mono font-medium text-slate-700">
                                                    R$ {expense.value.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-3 text-xs text-slate-400 truncate max-w-[150px]" title={expense.source_file}>
                                                    {expense.source_file}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                Nenhuma despesa encontrada para esta categoria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {filteredExpenses.length > 50 && (
                                <div className="px-6 py-3 text-center text-sm text-slate-400 bg-slate-50 border-t">
                                    Mostrando 50 de {filteredExpenses.length} transações
                                </div>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Dashboard;