import { fetchConversation, saveMessage, saveNewConversation } from "../api/firebase/firebaseFirestore.js"
import { GROQ_RESPONSE_ROLE } from "../api/groqAI/groqAIChat.js";
import { log } from "../helper/logger.js";
import { Community, Config } from "./remoteConfig.js";


// MARK: Variable
export const Conversation = new Map();


// MARK: Handler
export async function getConversationHistory(channelId) {
    if (!Conversation.has(channelId)) {
        try {
            const conversation = await fetchConversation(channelId);
            Conversation.set(
                channelId, 
                conversation.length <= 0 ? await createNewConversation(channelId) : conversation
            );
        } catch (error) {
            log(["CONVERSATION"], error, true);
        }
    }

    return Conversation.get(channelId);
}

export async function pushConversationMessage(channelId, authorName, authorRole, messageContent) {
    const messageObject = {
        author: authorName,
        role: authorRole,
        content: messageContent,
        timestamp: new Date().toISOString()
    };

    try {
        await saveMessage(channelId, messageObject);
        if (Conversation.has(channelId)) {
            const conversationList = Conversation.get(channelId);
            conversationList.push(messageObject);
            Conversation.set(channelId, conversationList);
        } else {
            Conversation.set(channelId, [messageObject]);
        }
    } catch (error) {
        log(["CONVERSATION"], error, true);
    }
}

export async function createNewConversation(channelId) {
    const guildName = Community.getGuildNameByChannelId(channelId) ?? "Unknown";
    const promptedConversation = Config.llm_prompt.map(text => ({
        author: GROQ_RESPONSE_ROLE.system,
        role: GROQ_RESPONSE_ROLE.system,
        content: text.replace(/{{serverName}}/g, guildName),
        timestamp: new Date().toISOString()
    }));

    try {
        await saveNewConversation(channelId, promptedConversation);
        return promptedConversation;
    } catch (error) {
        log(["CONVERSATION"], error, true);
        return [];
    }
}