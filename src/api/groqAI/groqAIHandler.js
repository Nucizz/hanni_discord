import Groq from "groq-sdk";
import { config as envConfig } from "dotenv";
import { getChatStartPrompt } from "./groqAIPrompt.js";
import { GROQ_ERROR_MESSAGE } from "./groqAIConstant.js";


// MARK: Setup Helper

envConfig();


// MARK: Setup Groq Client

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// MARK: GroqAI Functions

export async function groqSendChat(author, content, history) {
  if (history.length === 0) {
    history.value = getChatStartPrompt();
  }

  history.value.push({
    role: "user",
    content: `${author} said ${content}`
  });

  try {
    const result = await getChatCompletion(history);
    return result || GROQ_ERROR_MESSAGE;
  } catch (error) {
    console.log(`[ERROR][GROQ] ${error}`);
    return GROQ_ERROR_MESSAGE;
  }
}

export async function groqNewChat(history) {
  history.value = getChatStartPrompt();

  try {
      const result = await getChatCompletion(history);
      return result || GROQ_ERROR_MESSAGE;
  } catch (error) {
      console.log(`[ERROR][GROQ] ${error}`);
      return GROQ_ERROR_MESSAGE;
  }
}


// MARK: GroqAI Helpers

async function getChatCompletion(conversationArray) {
  const result = await groq.chat.completions.create({
    messages: conversationArray.value,
    model: "llama3-8b-8192",
    temperature: 0.3,
    max_tokens: 512
  });

  conversationArray.value.push({
    role: "assistant",
    content: result.choices[0]?.message?.content
  });

  return result.choices[0]?.message?.content;
}
