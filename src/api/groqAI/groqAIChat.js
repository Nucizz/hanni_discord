import { AI_CONVERSATION_ROLE } from "../../handler/ai/aiHandler.js";
import { log } from "../../helper/loggerHelper.js";
import { groqClient } from "./groqAIConfig.js";


// MARK: Handler
export async function sendGroqChat(conversation) {
    try {
        const result = await getGroqCompletion(conversation);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getGroqCompletion(conversation) {
    const result = await groqClient.chat.completions.create({
        messages: convertConversationToGroqResponse(conversation),
        model: "llama3-8b-8192",
        temperature: 0.3,
        max_tokens: 2048
    });

    return result.choices[0]?.message?.content;
}

function convertConversationToGroqResponse(conversation) {
    let convertFailure = 0;
    const convertedConversation = conversation.map(message => {
        switch (message.role) {
            case AI_CONVERSATION_ROLE.user:
                return {
                    role: AI_CONVERSATION_ROLE.user,
                    content: `${message.author}: ${message.content}`
                };

            case AI_CONVERSATION_ROLE.assistant:
                return {
                    role: AI_CONVERSATION_ROLE.assistant,
                    content: message.content
                };

            case AI_CONVERSATION_ROLE.system:
                return {
                    role: AI_CONVERSATION_ROLE.system,
                    content: message.content
                };

            default:
                convertFailure = convertFailure + 1;
        }
    });

    if (convertFailure > 0) {
        log(["GROQ", "CONVERT"], `Conversation converted with ${convertFailure} failure.`, true);
    }
    return convertedConversation;
}