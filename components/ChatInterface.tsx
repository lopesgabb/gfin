import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, Expense } from '../types';
import { GeminiService } from '../services/gemini';
import { useChatStore, useUserStore } from '../stores';

import { PROFILE_DESCRIPTIONS } from '../constants/quizData';
import { Send, User, Bot, Loader2, AlertTriangle, Sparkles, Trash2, History } from 'lucide-react';
import { Button } from './ui/Button';


interface ChatInterfaceProps {
  profile: UserProfile;
  expenses: Expense[];
  selectedFilter: string;
}

const SUGGESTED_QUESTIONS = [
  "Qual a diferença entre Tesouro Selic e Tesouro IPCA+?",
  "Como montar uma carteira para meu perfil?",
  "Quanto preciso investir para ter renda de R$5000/mês?",
  "Quais investimentos são mais seguros para iniciantes?",
  "O que é CDI e como ele afeta meus investimentos?",
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ profile, expenses, selectedFilter }) => {
  const { history, addMessage, clearHistory, loadHistory } = useChatStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const profileInfo = PROFILE_DESCRIPTIONS[profile.risk];

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    addMessage({ role: 'user', content: userMsg });
    setIsLoading(true);

    // Calculate Context
    const relevantExpenses = selectedFilter === 'Todas'
      ? expenses
      : expenses.filter(e => (e.category || 'Outros') === selectedFilter);

    const total = relevantExpenses.reduce((sum, e) => sum + e.value, 0);
    const count = relevantExpenses.length;

    const financialContext = `
      RESUMO DOS DADOS ATUAIS NO DASHBOARD:
      - Filtro Selecionado pelo Usuário: \${selectedFilter}
      - Valor Total Gasto (neste filtro): R$ \${total.toFixed(2)}
      - Quantidade de Transações: \${count}
      - Top 5 Transações (Valor):
        \${relevantExpenses
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map(e => `- \${e.date}: \${e.merchant} (R$ \${e.value.toFixed(2)}) - \${e.category}`)
        .join('\n')}
    `;

    try {
      const response = await GeminiService.chatWithMentor(userMsg, history, profile, financialContext);
      addMessage({ role: 'model', content: response });
    } catch (error) {
      addMessage({ role: 'model', content: "Desculpe, ocorreu um erro na comunicação. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Aviso:</strong> Conteúdo educacional. Não constitui recomendação de investimento.
          Consulte um profissional certificado (CPA/CEA) antes de investir.
        </span>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-2xl">🤖</span> Mentor Financeiro
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gemini 2.5 Pro com Google Search • Perfil: {profileInfo.emoji} {profile.risk}
            </p>
          </div>

          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => {
                if (window.confirm('Limpar histórico de conversas?')) {
                  clearHistory();
                }
              }}
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center">
              <Bot className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 max-w-md mb-2">
                Olá! Sou seu mentor financeiro pessoal. Posso te ajudar com:
              </p>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>✓ Dúvidas sobre investimentos</li>
                <li>✓ Análise dos seus gastos</li>
                <li>✓ Estratégias para seu perfil {profile.risk}</li>
                <li>✓ Cotações e notícias do mercado</li>
              </ul>
            </div>

            {expenses.length > 0 && (
              <div className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
                📊 Tenho acesso aos dados do seu Dashboard ({selectedFilter})
              </div>
            )}

            {/* Suggested Questions */}
            <div className="w-full max-w-lg">
              <p className="text-xs text-slate-400 text-center mb-3">Sugestões para começar:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 hover:border-emerald-300 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {history.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 \${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                <Bot className="w-5 h-5 text-emerald-600" />
              </div>
            )}

            <div className={`
                max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm
                \${msg.role === 'user'
                ? 'bg-slate-800 text-white rounded-tr-sm'
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'}
            `}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className="mb-1 min-h-[1rem]">
                  {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .split(/(<strong>.*?<\/strong>)/g).map((part, j) =>
                      part.startsWith('<strong>')
                        ? <strong key={j}>{part.replace(/<\/?strong>/g, '')}</strong>
                        : part
                    )}
                </p>
              ))}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 border border-emerald-200">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Pesquisando e analisando...
            </div>
          </div>
        )}
      </div>



      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Pergunte sobre finanças, investimentos, ou seus gastos...`}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-700 placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;