import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'q1',
        question: 'Qual é o seu principal objetivo financeiro nos próximos 5 anos?',
        options: [
            { text: 'Ter segurança e preservar meu patrimônio', points: 1 },
            { text: 'Crescer de forma equilibrada', points: 2 },
            { text: 'Maximizar ganhos, aceitando oscilações', points: 3 },
        ],
    },
    {
        id: 'q2',
        question: 'Se seus investimentos caíssem 20% em um mês, o que você faria?',
        options: [
            { text: 'Venderia tudo imediatamente', points: 1 },
            { text: 'Manteria e esperaria recuperar', points: 2 },
            { text: 'Investiria mais aproveitando a queda', points: 3 },
        ],
    },
    {
        id: 'q3',
        question: 'Qual a sua experiência com investimentos?',
        options: [
            { text: 'Nunca investi além da poupança', points: 1 },
            { text: 'Já investi em renda fixa (CDB, Tesouro)', points: 2 },
            { text: 'Invisto em ações, fundos ou criptomoedas', points: 3 },
        ],
    },
    {
        id: 'q4',
        question: 'Por quanto tempo você pode deixar o dinheiro investido?',
        options: [
            { text: 'Menos de 1 ano - posso precisar a qualquer momento', points: 1 },
            { text: 'De 1 a 5 anos', points: 2 },
            { text: 'Mais de 5 anos - é para longo prazo', points: 3 },
        ],
    },
    {
        id: 'q5',
        question: 'O que você prioriza em um investimento?',
        options: [
            { text: 'Segurança - não aceito perder dinheiro', points: 1 },
            { text: 'Equilíbrio entre segurança e rentabilidade', points: 2 },
            { text: 'Rentabilidade - aceito riscos por maiores ganhos', points: 3 },
        ],
    },
    {
        id: 'q6',
        question: 'Qual percentual da sua renda você consegue poupar por mês?',
        options: [
            { text: 'Menos de 10% - sobra pouco', points: 1 },
            { text: 'Entre 10% e 30%', points: 2 },
            { text: 'Mais de 30%', points: 3 },
        ],
    },
    {
        id: 'q7',
        question: 'Você já tem uma reserva de emergência (6 meses de despesas)?',
        options: [
            { text: 'Não tenho reserva', points: 1 },
            { text: 'Tenho parcialmente (1-5 meses)', points: 2 },
            { text: 'Sim, tenho 6 meses ou mais', points: 3 },
        ],
    },
    {
        id: 'q8',
        question: 'Como você se sentiria vendo seu patrimônio oscilar 30% em um ano?',
        options: [
            { text: 'Muito desconfortável, perderia o sono', points: 1 },
            { text: 'Desconfortável, mas entendo que faz parte', points: 2 },
            { text: 'Tranquilo, faz parte do jogo', points: 3 },
        ],
    },
];

export const getProfileFromScore = (score: number): 'Conservador' | 'Moderado' | 'Arrojado' => {
    const maxScore = QUIZ_QUESTIONS.length * 3;
    const percentage = (score / maxScore) * 100;

    if (percentage <= 40) return 'Conservador';
    if (percentage <= 70) return 'Moderado';
    return 'Arrojado';
};

export const PROFILE_DESCRIPTIONS = {
    Conservador: {
        emoji: '🛡️',
        title: 'Conservador',
        description: 'Você valoriza a segurança acima de tudo. Prefere investimentos estáveis que protejam seu patrimônio, mesmo que o rendimento seja menor.',
        recommendations: [
            'Tesouro Selic e Tesouro IPCA+',
            'CDB de bancos grandes (com FGC)',
            'Fundos DI e Renda Fixa',
            'Poupança (para reserva de curtíssimo prazo)',
        ],
        allocation: { rendaFixa: 80, rendaVariavel: 10, reserva: 10 },
    },
    Moderado: {
        emoji: '⚖️',
        title: 'Moderado',
        description: 'Você busca equilíbrio entre segurança e crescimento. Aceita alguma oscilação em troca de melhores retornos no médio prazo.',
        recommendations: [
            'Tesouro IPCA+ (maior parte)',
            'CDBs e LCIs/LCAs',
            'Fundos Multimercado',
            'ETFs de índice (BOVA11, IVVB11)',
            'Até 20-30% em ações',
        ],
        allocation: { rendaFixa: 60, rendaVariavel: 30, reserva: 10 },
    },
    Arrojado: {
        emoji: '🚀',
        title: 'Arrojado',
        description: 'Você aceita volatilidade em busca de maiores retornos. Tem horizonte de longo prazo e sangue frio para suportar quedas.',
        recommendations: [
            'Ações de crescimento',
            'ETFs internacionais',
            'Fundos de ações',
            'FIIs (Fundos Imobiliários)',
            'Criptomoedas (pequena parcela)',
        ],
        allocation: { rendaFixa: 30, rendaVariavel: 60, reserva: 10 },
    },
};
