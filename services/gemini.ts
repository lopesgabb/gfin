import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, UserProfile, VALID_CATEGORIES } from "../types";

// Initialize the client
// CRITICAL: process.env.API_KEY is assumed to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  /**
   * ETL Function: Extracts data from PDF/Image using Gemini 2.5 Flash
   */
  processInvoice: async (fileBase64: string, mimeType: string, filename: string) => {
    const prompt = `
      Atue como um extrator de dados preciso. Analise o arquivo fornecido (${filename}).
      
      TAREFA:
      1. Identifique transações financeiras.
      2. Extraia os dados preenchendo EXATAMENTE as seguintes chaves JSON:
         - date (Formato YYYY-MM-DD)
         - merchant (Nome do estabelecimento)
         - value (Valor numérico, float positivo)
         - category (Uma das categorias permitidas)
      3. Categorias permitidas: ${JSON.stringify(VALID_CATEGORIES)}.
      4. Se a categoria não estiver clara, use "Outros".
      5. Retorne APENAS um JSON válido seguindo o schema.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: fileBase64
                }
              },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.0,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              expenses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    merchant: { type: Type.STRING },
                    value: { type: Type.NUMBER },
                    category: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];

      const data = JSON.parse(text);

      // Inject filename as source_file and provide robust fallbacks
      return (data.expenses || []).map((item: any) => ({
        date: item.date || new Date().toISOString().split('T')[0],
        merchant: item.merchant || "Desconhecido",
        value: Number(item.value) || 0,
        // Fallback checks for common capitalization errors or missing data
        category: item.category || item.Category || item.categoria || "Outros",
        source_file: filename,
      }));

    } catch (error) {
      console.error("Gemini ETL Error:", error);
      throw error;
    }
  },

  /**
   * Chat Function: Consults Gemini 2.5 Pro with Grounding
   */
  chatWithMentor: async (message: string, history: ChatMessage[], profile: UserProfile, financialContext: string) => {
    const systemInstruction = `
      Você é o GFin, um Consultor Financeiro de Elite.
      
      PERFIL DO USUÁRIO:
      - Renda: R$ ${profile.salary}
      - Perfil: ${profile.risk}
      
      DADOS FINANCEIROS ATUAIS (VISÃO DO DASHBOARD):
      ${financialContext}
      
      FERRAMENTAS:
      - Use 'Google Search' para buscar cotações (Dólar, Selic, Ações) e notícias atuais.
      
      INSTRUÇÕES:
      1. Use os "DADOS FINANCEIROS ATUAIS" para responder perguntas sobre gastos específicos.
      2. Se o usuário perguntar "quanto gastei?", use o valor do contexto fornecido.
      3. Responda dúvidas sobre economia, investimentos e planejamento.
      4. Use Markdown e Tabelas para explicar conceitos.
    `;

    // Convert history to Gemini format
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Add new message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          tools: [{ googleSearch: {} }] // Enable Google Search Grounding
        }
      });

      return response.text || "Desculpe, não consegui processar a resposta.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "Erro ao conectar com o Mentor Financeiro. Tente novamente.";
    }
  }
};
