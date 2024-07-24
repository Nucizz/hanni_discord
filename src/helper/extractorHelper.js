import Tesseract from "tesseract.js";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import { log } from "./loggerHelper";

async function extractTextFromPDF(pdfBuffer) {
    try {
      const pdfData = await pdfParse(pdfBuffer);
      return pdfData.text;
    } catch (error) {
      log(["PDF_PARSE"], error, true);
      return "[Failed to extract text from PDF]";
    }
  }
  
  async function extractTextFromImage(imageBuffer) {
    try {
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
      return text;
    } catch (error) {
      log(["TESSERACT"], error, true);
      return "[Failed to extract text from image]";
    }
  }
  
  async function extractTextFromText(textBuffer) {
    try {
      const text = Buffer.from(textBuffer).toString('utf-8');
      return text;
    } catch (error) {
      log(["TEXT_EXTRACTION", "BUFFER"], error, true);
      return "[Failed to extract text from .txt file]";
    }
  }