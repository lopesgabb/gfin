import React, { useState } from 'react';
import { useGoalsStore } from '../../stores';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { Target, Plus, TrendingUp, Calendar, Trash2 } from 'lucide-react';

const GoalsPage: React.FC = () => {
    const { goals, addGoal, deleteGoal, addToGoal } = useGoalsStore();
    const [showModal, setShowModal] = useState(false);
    
    // Form State
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [deadline, setDeadline] = useState("");
    const [icon, setIcon] = useState("🎯");

    const handleAddGoal = () => {
        if (!name || !targetAmount) return;
        addGoal({
            name,
            targetAmount: Number(targetAmount),
            currentAmount: 0,
            deadline,
            icon
        });
        setShowModal(false);
        setName("");
        setTargetAmount("");
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Metas de Investimento</h1>
                    <p className="text-slate-500">Transforme seus sonhos em números e datas</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <Plus className="w-4 h-4" />
                    Nova Meta
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                        <Card key={goal.id} className="hover:shadow-md transition-shadow group">
                            <CardBody className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                                            {goal.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{goal.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                                <Calendar className="w-3 h-3" />
                                                Até {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Sem prazo'}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => deleteGoal(goal.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-emerald-600">R$ {goal.currentAmount.toLocaleString()}</span>
                                        <span className="text-slate-400">R$ {goal.targetAmount.toLocaleString()}</span>
                                    </div>
                                    <ProgressBar value={goal.currentAmount} max={goal.targetAmount} size="lg" />
                                    <div className="flex justify-between items-center text-xs">
                                        <span className={progress >= 100 ? 'text-emerald-500 font-bold' : 'text-slate-500'}>
                                            {progress.toFixed(0)}% concluído
                                        </span>
                                        <button 
                                            onClick={() => {
                                                const amount = prompt("Quanto deseja adicionar à meta?", "1000");
                                                if (amount) addToGoal(goal.id, Number(amount));
                                            }}
                                            className="text-emerald-600 font-bold hover:underline"
                                        >
                                            + Guardar Dinheiro
                                        </button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {goals.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700">Comece a planejar seus sonhos</h3>
                    <p className="text-slate-500 mt-2 mb-6">Cada pequena economia te deixa mais perto do seu objetivo.</p>
                    <Button variant="primary" onClick={() => setShowModal(true)}>Defina sua primeira meta</Button>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Meta Financeira">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome do Sonho</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Viagem Japão, Reserva de Emergência..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor Almejado</label>
                            <input 
                                type="number"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(Number(e.target.value).toString())}
                                placeholder="R$ 10.000"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Até quando?</label>
                            <input 
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ícone</label>
                        <div className="flex gap-2 p-2 bg-slate-50 rounded-xl">
                            {['🎯', '🏠', '🚗', '🏖️', '🎓', '💍', '💻', '📈'].map(i => (
                                <button
                                    key={i}
                                    onClick={() => setIcon(i)}
                                    className={`text-2xl p-2 rounded-lg transition-colors ${icon === i ? 'bg-white shadow-sm ring-2 ring-emerald-500' : 'hover:bg-white'}`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
                        <Button variant="primary" onClick={handleAddGoal} className="flex-1">Adicionar Meta</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GoalsPage;
