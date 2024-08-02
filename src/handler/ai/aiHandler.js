import { sendGeminiChat } from "../../api/gemini/geminiChat.js"
import { sendGroqChat } from "../../api/groqAI/groqAIChat.js"
import { log } from "../../helper/loggerHelper.js"

// MARK: Static
export const AI_CONVERSATION_ROLE = {
    system: "system",
    assistant: "assistant",
    user: "user"
}

const AI_MODEL = {
    gemini: sendGeminiChat,
    groq: sendGroqChat
}


// MARK: Settings
const primaryModel = AI_MODEL.gemini
const secondaryModel = AI_MODEL.groq


// MARK: Handler
export async function handleConversation(conversation) {
    if (primaryModel === secondaryModel) {
        log(["AI", "MODEL", "CONVERSATION"], "Please use different secondary model incase of fallback!", true);
    }

    try {
        return await primaryModel(conversation);
    } catch (primaryError) {
        log(["AI", "MODEL", "CONVERSATION"], `Primary model failed: ${primaryError}`, true);

        try {
            return await secondaryModel(conversation);
        } catch (secondaryError) {
            log(["AI", "MODEL", "CONVERSATION"], `Secondary model failed: ${secondaryError}`, true);
            return `***Ouch, please fix this error:*** \n**Primary:**\`\`\`json\n${primaryError}\`\`\`\n**Secondary:**\`\`\`json\n${secondaryError}\`\`\``;
        }
    }
}