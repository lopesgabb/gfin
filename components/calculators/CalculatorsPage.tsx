import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
    Calculator, 
    ArrowRight, 
    TrendingUp, 
    DollarSign,
    RefreshCcw,
    BarChart3
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const CalculatorsPage: React.FC = () => {
    // State for Compound Interest
    const [principal, setPrincipal] = useState(1000);
    const [monthly, setMonthly] = useState(500);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const simulationData = useMemo(() => {
        const data = [];
        let balance = principal;
        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;

        for (let m = 0; m <= totalMonths; m++) {
            if (m > 0) {
                balance = (balance + monthly) * (1 + monthlyRate);
            }
            
            // Only push every 12 months (each year) for cleaner chart
            if (m % 12 === 0) {
                data.push({
                    year: m / 12,
                    balance: Math.round(balance),
                    deposited: Math.round(principal + (monthly * m))
                });
            }
        }
        return data;
    }, [principal, monthly, rate, years]);

    const finalBalance = simulationData[simulationData.length - 1].balance;
    const totalDeposited = simulationData[simulationData.length - 1].deposited;
    const totalInterest = finalBalance - totalDeposited;

    return (
        <div className="p-6 space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Simuladores Inteligentes</h1>
                <p className="text-slate-500">Planeje seu futuro com cálculos precisos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <RefreshCcw className="w-5 h-5 text-emerald-500" />
                            Simular Juros Compostos
                        </h3>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Investimento Inicial
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                                <input 
                                    type="number"
                                    value={principal}
                                    onChange={(e) => setPrincipal(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Aporte Mensal
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                                <input 
                                    type="number"
                                    value={monthly}
                                    onChange={(e) => setMonthly(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Taxa Anual (%)
                                </label>
                                <input 
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Anos (Tempo)
                                </label>
                                <input 
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Results and Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-600/20">
                            <p className="text-emerald-100/80 text-sm mb-1 uppercase tracking-wider font-bold">Total Final</p>
                            <h4 className="text-2xl font-black">R$ {finalBalance.toLocaleString()}</h4>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">Total Investido</p>
                            <h4 className="text-2xl font-bold text-slate-800">R$ {totalDeposited.toLocaleString()}</h4>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">Total em Juros</p>
                            <h4 className="text-2xl font-bold text-emerald-600">R$ {totalInterest.toLocaleString()}</h4>
                        </div>
                    </div>

                    <Card className="flex-1">
                        <CardHeader>
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-emerald-500" />
                                Evolução do Patrimônio
                            </h3>
                        </CardHeader>
                        <CardBody className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={simulationData}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <YAxis hide />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(val: number) => [`R$ ${val.toLocaleString()}`, 'Valor']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="balance" 
                                        stroke="#10b981" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorBalance)" 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="deposited" 
                                        stroke="#94a3b8" 
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fill="none" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CalculatorsPage;
