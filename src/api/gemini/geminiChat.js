import { log } from "../../helper/loggerHelper.js";
import { geminiClient } from "../gemini/geminiConfig.js"


// MARK: Handler
export async function sendGeminiChat(conversation) {
    try {
        const result = await getGeminiCompletion(conversation);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getGeminiCompletion(conversation) {
    const prompt = convertConversationToGeminiResponse(conversation)
    const result = await geminiClient.generateContent(prompt);
    
    return result.response.text();
}

function convertConversationToGeminiResponse(conversation) {
    let convertCount = 0;
    let convertFailure = 0;
    const convertedConversation = conversation.map(message => {
        convertCount = convertCount + 1;
        switch (message.role) {
            case 'user':
                return `[${convertCount - convertFailure}] ${message.author}: ${message.content}\n`;

            case 'assistant':
                return `[${convertCount - convertFailure}] GEMINI AI: ${message.content}\n`;

            case 'system':
                return `[${convertCount - convertFailure}] NODE JS: ${message.content}\n`;

            default:
                convertFailure = convertFailure + 1;
        }
    });

    if (convertFailure > 0) {
        log(["GEMINI", "CONVERT"], `Conversation converted with ${convertFailure} failure.`, true);
    }
    return convertedConversation;
}