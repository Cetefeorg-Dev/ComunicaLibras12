import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API
  let ai: GoogleGenAI | null = null;
  const initAI = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set.");
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
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
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text?.trim() });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
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
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      const suggestions = text.split("|").map(s => s.trim()).filter(Boolean);
      res.json({ suggestions });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
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
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text?.trim() });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Translate video frames
  app.post("/api/ai/translate-video", express.json({limit: '20mb'}), async (req, res) => {
    try {
      const { frames } = req.body;
      if (!frames || !Array.isArray(frames)) {
        return res.status(400).json({ error: "No frames provided" });
      }

      const api = initAI();

      const parts = frames.map((frameValue: string) => {
        // Strip the data:image/jpeg;base64, part
        const base64Data = frameValue.replace(/^data:image\/\w+;base64,/, "");
        return {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        };
      });

      const promptPart = {
        text: `Você é uma Inteligência Artificial tradutora de Língua Brasileira de Sinais (Libras). 
Abaixo estão alguns frames sequenciais extraídos de um vídeo de uma pessoa. 
Por favor, analise a expressão facial, os movimentos das mãos e a postura.
Tente interpretar os gestos observados e dê um palpite da frase ou ação que a pessoa estaria expressando (Ex: "Estou feliz!", "Preciso de ajuda", "Tudo bem?").
Caso não consiga reconhecer um sinal claro, faça uma leitura corporal e invente uma tradução provável e educada (uma frase de no máximo 5 palavras).
IMPORTANTE: Não explique o que você está vendo. Apenas retorne a Frase Final Traduzida diretamente, como se você fosse o tradutor escrevendo a legenda final na tela. Nada a mais.`
      };

      const response = await api.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [promptPart, ...parts],
      });

      res.json({ result: response.text?.trim() });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
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
