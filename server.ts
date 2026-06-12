import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Initialize Gemini API
  let ai: GoogleGenAI | null = null;
  const initAI = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set.");
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
    }
    return ai;
  };

  // Helper to handle AI Errors
  const handleAIError = (error: any, res: express.Response) => {
    console.error("AI Error:", error);
    const isAuthError = error?.message?.includes("authentication") || error?.status === 401;
    const isModelError = error?.status === 503 || error?.message?.includes("model") || error?.status === 429;
    
    let errorMessage = error.message;
    if (isAuthError) {
      errorMessage = "Erro de autenticação: Chave de API (GEMINI_API_KEY) inválida ou não configurada corretamente. Por favor, gere uma chave válida no Google AI Studio (iniciando com 'AIza...').";
    } else if (isModelError) {
      errorMessage = "Serviço da IA está temporariamente indisponível devido a alta demanda ou limite de requisições. Tente novamente em alguns segundos.";
    }

    res.status(isAuthError ? 401 : 500).json({ error: errorMessage });
  };

  // API Route: Correct and simplify text
  app.post("/api/ai/correct", async (req, res) => {
    try {
      const { text } = req.body;
      const api = initAI();
      
      const prompt = `Você é um assistente especialista em acessibilidade de comunicação para pessoas surdas. 
O texto enviado a seguir pode conter erros gramaticais ou usar linguagem excessivamente complexa.
Por favor, corrija o texto da melhor forma possível e reescreva de maneira simples e direta, muito fácil de entender.
Se for uma frase já simples, apenas corrija a gramática se necessário.
Responda APENAS com o texto corrigido e simplificado.

Texto original:
"${text}"`;

      const response = await api.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      res.json({ result: response.text?.trim() });
    } catch (error: any) {
      handleAIError(error, res);
    }
  });

  // API Route: Generate suggested fast replies
  app.post("/api/ai/suggest-replies", async (req, res) => {
    try {
      const { context } = req.body;
      const api = initAI();
      
      const prompt = `Você está auxiliando um usuário surdo numa conversa via chat.
Baseado na última mensagem recebida, gere 3 sugestões de respostas curtas, práticas e naturais.
Retorne AS 3 SUGESTÕES SEPARADAS POR BARRA VERTICAL (|) e mais nada.

Última mensagem recebida:
"${context}"`;

      const response = await api.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      const suggestions = text.split("|").map(s => s.trim()).filter(Boolean);
      res.json({ suggestions });
    } catch (error: any) {
      handleAIError(error, res);
    }
  });


  // API Route: Smart Translator Libras Portuguese -> Natural Portuguese
  app.post("/api/ai/comunica", async (req, res) => {
    try {
      const { text } = req.body;
      const api = initAI();
      
      const prompt = `Você é o "IA Comunica+", um Tradutor Inteligente Especializado em converter "Português Sinalizado" (escrito com estrutura gramatical da Libras) para Português Natural escrito.

A pessoa surda muitas vezes escreve seguindo a estrutura gramatical da Libras (Língua Brasileira de Sinais), que difere do português escrito. Padrões comuns:
1. Ordem das palavras diferente (frequentemente Sujeito-Objeto-Verbo ou Tópico-Comentário).
2. Omissão de artigos e preposições.
3. Uso de verbos no infinitivo.
4. Construções visuais diretas.

Seu objetivo:
Interpretar a real intenção do usuário e reescrever a frase em Português Natural, preservando o significado original, para que um falante de português ouvinte entenda perfeitamente.

Exemplos:
Entrada: "Eu médico querer agora dor barriga forte."
Saída: "Eu preciso consultar um médico porque estou com uma forte dor na barriga."

Entrada: "Amanhã trabalho eu não porque consulta hospital."
Saída: "Amanhã não poderei trabalhar porque tenho uma consulta no hospital."

Entrada: "Você repetir lento eu entender pouco."
Saída: "Poderia repetir mais devagar? Estou com dificuldade para entender."

Responda APENAS com a frase traduzida final.

Entrada do usuário:
"${text}"`;

      const response = await api.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      res.json({ result: response.text?.trim() });
    } catch (error: any) {
      handleAIError(error, res);
    }
  });

  // API Route: Translate video frames
  app.post("/api/ai/translate-video", express.json({limit: '50mb'}), async (req, res) => {
    try {
      const { video, mimeType } = req.body;
      if (!video) {
        return res.status(400).json({ error: "No video provided" });
      }

      const api = initAI();

      const base64Data = video.replace(/^data:(.*);base64,/, "");
      const videoPart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType || "video/webm"
        }
      };

      const promptPart = {
        text: `Você é uma Inteligência Artificial tradutora de Língua Brasileira de Sinais (Libras). 
Abaixo está um pequeno clipe de vídeo do usuário sinalizando.
Analise as expressões faciais e os movimentos.
Sua tarefa é interpretar os sinais observados e formar uma frase fluida e natural em Português.
Desconsidere completamente movimentos aleatórios ou pausas.
Se os sinais não formarem um sentido lógico claro, ou for apenas movimentos sem sentido, responda com texto vazio ou uma das opções: "Não entendi" ou "Movimento não reconhecido".
IMPORTANTE: Não explique o que você está vendo nem forneça notas textuais. Apenas retorne a FRASE FINAL TRADUZIDA diretamente. Nada a mais.`
      };

      const response = await api.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [promptPart, videoPart],
      });

      res.json({ result: response.text?.trim() });
    } catch (error: any) {
      handleAIError(error, res);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
