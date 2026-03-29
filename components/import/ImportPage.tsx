import React, { useState } from 'react';
import { useExpensesStore } from '../../stores';
import { GeminiService } from '../../services/gemini';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
    Upload, 
    FileText, 
    ArrowRight, 
    Sparkles, 
    CheckCircle2, 
    AlertCircle, 
    Loader2,
    Calendar,
    Target
} from 'lucide-react';

const ImportPage: React.FC = () => {
    const { addExpenses } = useExpensesStore();
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [processedItems, setProcessedItems] = useState<any[]>([]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setFeedback(null);
        setProcessedItems([]);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                
                // Call Gemini ETL
                const result = await GeminiService.processInvoice(base64, file.type, file.name);
                
                if (result.length > 0) {
                    setProcessedItems(result);
                    setFeedback({ 
                        type: 'success', 
                        message: `Extraímos ${result.length} transações com sucesso!` 
                    });
                } else {
                    setFeedback({ 
                        type: 'error', 
                        message: 'Nenhuma transação foi encontrada neste arquivo.' 
                    });
                }
                setIsLoading(false);
            };
        } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', message: 'Erro ao processar arquivo. Verifique o formato.' });
            setIsLoading(false);
        }
    };

    const handleConfirmImport = () => {
        addExpenses(processedItems);
        setProcessedItems([]);
        setFeedback({ type: 'success', message: 'Dados importados para o seu Dashboard!' });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-2">
                    <Sparkles className="w-3 h-3" />
                    POWERED BY GEMINI 2.5 FLASH
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Importação Inteligente</h1>
                <p className="text-slate-500">Envie faturas em PDF ou fotos de comprovantes e deixe a IA cuidar da organização.</p>
            </div>

            {/* Upload Zone */}
            <div className="relative group">
                <input 
                    type="file" 
                    onChange={handleFileUpload}
                    accept="application/pdf,image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isLoading}
                />
                <div className={`
                    border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-300
                    ${isLoading ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 group-hover:border-emerald-500 group-hover:bg-emerald-50/30'}
                `}>
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {isLoading ? (
                            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                        ) : (
                            <Upload className="w-10 h-10 text-emerald-600" />
                        )}
                    </div>
                    <p className="text-lg font-bold text-slate-700">Clique ou arraste seu arquivo</p>
                    <p className="text-slate-400 text-sm mt-1">Formatos aceitos: PDF, PNG, JPG de faturas e recibos</p>
                </div>
            </div>

            {/* Results Preview */}
            {processedItems.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 px-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Conferir Dados
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Estabelecimento</th>
                                    <th className="px-6 py-4">Categoria</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {processedItems.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">{new Date(item.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-800">{item.merchant}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-medium text-xs">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                                            R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setProcessedItems([])}>Limpar</Button>
                        <Button variant="primary" onClick={handleConfirmImport}>Confirmar Importação no App</Button>
                    </div>
                </div>
            )}

            {feedback && !processedItems.length && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95 ${
                    feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                }`}>
                    {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium text-sm">{feedback.message}</span>
                </div>
            )}

            {/* Instruction Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
                <div className="text-center p-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-5 h-5 text-slate-500" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">Upload</h4>
                    <p className="text-xs text-slate-400 mt-1">Envie o arquivo bruto da sua fatura bancária</p>
                </div>
                <div className="text-center p-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-lg">✨</div>
                    <h4 className="font-bold text-slate-700 text-sm">IA Extract</h4>
                    <p className="text-xs text-slate-400 mt-1">O Gemini extrai cada gasto, data e valor automaticamente</p>
                </div>
                <div className="text-center p-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Target className="w-5 h-5 text-slate-500" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">Dashboard</h4>
                    <p className="text-xs text-slate-400 mt-1">Os dados são adicionados aos seus gráficos e orçamentos</p>
                </div>
            </div>
        </div>
    );
};

export default ImportPage;
