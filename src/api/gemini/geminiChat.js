import { AI_CONVERSATION_ROLE } from "../../handler/ai/aiHandler.js";
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
    let convertFailure = 0;
    const convertedConversation = conversation.map(message => {
        switch (message.role) {
            case AI_CONVERSATION_ROLE.user:
                return `${message.author}: ${message.content}\n`;

            case AI_CONVERSATION_ROLE.assistant:
                return `${AI_CONVERSATION_ROLE.assistant}: ${message.content}\n`;

            case AI_CONVERSATION_ROLE.system:
                return `${AI_CONVERSATION_ROLE.system}: ${message.content}\n`;

            default:
                convertFailure = convertFailure + 1;
        }
    });

    if (convertFailure > 0) {
        log(["GEMINI", "CONVERT"], `Conversation converted with ${convertFailure} failure.`, true);
    }
    return convertedConversation;
}