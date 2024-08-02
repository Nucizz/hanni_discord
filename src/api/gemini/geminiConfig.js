import { GoogleGenerativeAI } from '@google/generative-ai';
import { config as envConfig } from "dotenv";


// MARK: Config
envConfig();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const geminiClient = genAI.getGenerativeModel({ model: 'gemini-1.5-flash'});