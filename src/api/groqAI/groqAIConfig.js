import Groq from "groq-sdk";
import { config as envConfig } from "dotenv";


// MARK: Config
envConfig();
export const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// MARK: Service