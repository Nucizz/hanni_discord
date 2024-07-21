import Groq from "groq-sdk";
import axios from "axios";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import { config as envConfig } from "dotenv";
import { getChatStartPrompt } from "./groqAIPrompt.js";
import { Buffer } from 'buffer';


// MARK: Setup Helper

envConfig();


// MARK: Setup Groq Client

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// MARK: GroqAI Functions

export async function groqSendChat(author, content, attachments, history, guildName) {
  if (history.value.length === 0) {
    history.value = getChatStartPrompt(guildName);
  }

  var query = `${author}: ${content}`;
  query += await extractAttachments(attachments);

  history.value.push({
    role: "user",
    content: query
  });

  try {
    const result = await getChatCompletion(history);
    return result || "Sorry I don't understand.";
  } catch (error) {
    return handleGroqError(error);
  }
}


// MARK: GroqAI Helpers

async function getChatCompletion(conversationArray) {
  const result = await groq.chat.completions.create({
    messages: conversationArray.value,
    model: "llama3-8b-8192",
    temperature: 0.3,
    max_tokens: 2048
  });

  conversationArray.value.push({
    role: "assistant",
    content: result.choices[0]?.message?.content
  });

  return result.choices[0]?.message?.content;
}

async function extractAttachments(attachments) {
  if (!attachments) {
    return '';
  }

  let attachmentTexts = [];  
  for (const attachment of attachments) {
    try {
      const url = attachment[1].url;
      if (!url) {
        continue;
      }

      const response = await axios.get(url, { responseType: 'arraybuffer' });

      if (response.headers['content-type'] === 'application/pdf') {
        const pdfText = await extractTextFromPDF(response.data);
        attachmentTexts.push(`PDF: ${pdfText}`);
      } else if (response.headers['content-type'].startsWith('image/')) {
        const imageText = await extractTextFromImage(response.data);
        attachmentTexts.push(`Image: ${imageText}`);
      } else if (response.headers['content-type'].startsWith('text/plain')) {
        const textText = await extractTextFromText(response.data);
        attachmentTexts.push(`Text: ${textText}`);
      } else {
        attachmentTexts.push(`[Unsupported attachment type: ${response.headers['content-type']}]`);
      }
    } catch (error) {
      console.log(`[ERROR][ATTACHMENTS] ${error}`)
    }
  }

  return `Attachments data: ${attachmentTexts.join('\n')}`;
}

async function extractTextFromPDF(pdfBuffer) {
  try {
    const pdfData = await pdfParse(pdfBuffer);
    return pdfData.text;
  } catch (error) {
    console.error(`[ERROR][PDF_PARSE] ${error}`);
    return "[Failed to extract text from PDF]";
  }
}

async function extractTextFromImage(imageBuffer) {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
    return text;
  } catch (error) {
    console.error(`[ERROR][TESSERACT] ${error}`);
    return "[Failed to extract text from image]";
  }
}

async function extractTextFromText(textBuffer) {
  try {
    const text = Buffer.from(textBuffer).toString('utf-8');
    return text;
  } catch (error) {
    console.error(`[ERROR][TEXT_EXTRACTION] ${error}`);
    return "[Failed to extract text from .txt file]";
  }
}

function handleGroqError(raw) {
  console.log(`[ERROR][GROQ] ${raw}`);
  return "Ouch, I was killed with an error of " + raw;
}