import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
const api = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const models = await api.models.list();
    console.log(models);
}
run().catch(console.error);
