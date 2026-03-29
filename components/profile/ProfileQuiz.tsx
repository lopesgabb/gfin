import React, { useState } from 'react';
import { useUserStore } from '../../stores';
import { 
    QUIZ_QUESTIONS, 
    getProfileFromScore, 
    PROFILE_DESCRIPTIONS 
} from '../../constants/quizData';
import { Button } from '../ui/Button';
import { 
    ChevronRight, 
    ChevronLeft, 
    Sparkles, 
    ArrowRight 
} from 'lucide-react';

interface ProfileQuizProps {
    onComplete: () => void;
}

const ProfileQuiz: React.FC<ProfileQuizProps> = ({ onComplete }) => {
    const { completeQuiz } = useUserStore();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showResult, setShowResult] = useState(false);

    const question = QUIZ_QUESTIONS[currentQuestion];
    const totalQuestions = QUIZ_QUESTIONS.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    const handleAnswer = (points: number) => {
        setAnswers({ ...answers, [question.id]: points });
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const totalScore = Object.values(answers).reduce<number>((sum, pts) => sum + (pts as number), 0);
    const resultProfile = getProfileFromScore(totalScore);
    const profileInfo = PROFILE_DESCRIPTIONS[resultProfile];

    const handleFinish = () => {
        completeQuiz(resultProfile);
        onComplete();
    };

    if (showResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">{profileInfo.emoji}</div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Seu perfil é <span className="text-emerald-600">{profileInfo.title}</span>
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {profileInfo.description}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            Sugestões para seu perfil
                        </h3>
                        <ul className="space-y-2">
                            {profileInfo.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="text-emerald-500 mt-0.5">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-5 mb-8">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Alocação sugerida</h3>
                        <div className="flex gap-2 h-4 rounded-full overflow-hidden">
                            <div 
                                className="bg-emerald-500 transition-all" 
                                style={{ width: `${profileInfo.allocation.rendaFixa}%` }}
                                title={`Renda Fixa: ${profileInfo.allocation.rendaFixa}%`}
                            />
                            <div 
                                className="bg-blue-500 transition-all" 
                                style={{ width: `${profileInfo.allocation.rendaVariavel}%` }}
                                title={`Renda Variável: ${profileInfo.allocation.rendaVariavel}%`}
                            />
                            <div 
                                className="bg-amber-400 transition-all" 
                                style={{ width: `${profileInfo.allocation.reserva}%` }}
                                title={`Reserva: ${profileInfo.allocation.reserva}%`}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                            <span>🟢 Renda Fixa {profileInfo.allocation.rendaFixa}%</span>
                            <span>🔵 Renda Variável {profileInfo.allocation.rendaVariavel}%</span>
                            <span>🟡 Reserva {profileInfo.allocation.reserva}%</span>
                        </div>
                    </div>

                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="w-full"
                        onClick={handleFinish}
                    >
                        Continuar para o App
                        <ArrowRight className="w-5 h-5" />
                    </Button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                        ⚠️ Estas são sugestões educacionais. Consulte um profissional certificado antes de investir.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                {/* Progress */}
                <div className="bg-slate-100 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                        <span>Pergunta {currentQuestion + 1} de {totalQuestions}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                        {question.question}
                    </h2>

                    <div className="space-y-3">
                        {question.options.map((option, idx) => {
                            const isSelected = answers[question.id] === option.points;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option.points)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                        isSelected 
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                                        }`}>
                                            {isSelected && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <span className="text-sm font-medium">{option.text}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="px-8 pb-8 flex justify-between">
                    <Button 
                        variant="ghost" 
                        onClick={handleBack}
                        disabled={currentQuestion === 0}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleNext}
                        disabled={!answers[question.id]}
                    >
                        {currentQuestion === totalQuestions - 1 ? 'Ver Resultado' : 'Próxima'}
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileQuiz;
