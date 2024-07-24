import axios from "axios";
import { GROQ_RESPONSE_ROLE, sendGroqChat } from "../../api/groqAI/groqAIChat.js";
import { getConversationHistory, pushConversationMessage } from "../../constants/conversation.js";
import { log } from "../../helper/logger.js";
import { handleReply } from "../common/messageHandler.js";
import { handleSongPlayerCommand } from "../voices/songPlayerHandler.js";

export async function handleHelloHanni(message) {
    try {
        const conversation = await getConversationHistory(message.channel.id);
        
        await pushConversationMessage(
            message.channel.id, 
            message.author.username, 
            GROQ_RESPONSE_ROLE.user, 
            message.content + await handleAttachment(message.attachments)
        );

        const answer = await sendGroqChat(conversation, message.channel.id);
        await pushConversationMessage(message.channel.id, "Hanni", GROQ_RESPONSE_ROLE.assistant, answer);
        
        const systemCallback = await handleAnswer(answer, message);
        if (systemCallback) {
            const callbackAnswer = await handleSystemCallback(conversation, message.channel.id, systemCallback);
            handleReply(message, callbackAnswer);
        } else {
            handleReply(message, answer);
        }
    } catch (error) {
        log(["CONVERSATION"], error, true);
    }
}

async function handleSystemCallback(conversation, channelId, callbackContent) {
    await pushConversationMessage(
        channelId, 
        GROQ_RESPONSE_ROLE.system, 
        GROQ_RESPONSE_ROLE.system, 
        callbackContent
    );

    const answer = await sendGroqChat(conversation, channelId);
    return answer;
}

async function handleAnswer(answer, message) {
    if (answer.startsWith("JS--")) {
        return await handleCommand(answer.replace(/JS--/g, ""), message);
    } else {
        return null;
    }
}

async function handleCommand(command, message) {
    if (command.startsWith("song.")) {
        return await handleSongPlayerCommand(command.replace(/song./g, ""), message);
    } else {
        return "System doesn't recognize that command."
    }
}

async function handleAttachment(attachments) {
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
                attachmentTexts.push(`${attachment.fileName}.pdf: ${pdfText}`);

            } else if (response.headers['content-type'].startsWith('image/')) {
                const imageText = await extractTextFromImage(response.data);
                attachmentTexts.push(`${attachment.fileName}.png: ${imageText}`);

            } else if (response.headers['content-type'].startsWith('text/plain')) {
                const textText = await extractTextFromText(response.data);
                attachmentTexts.push(`${attachment.fileName}.txt: ${textText}`);

            } else {
                attachmentTexts.push(`[Unsupported attachment type: ${response.headers['content-type']}]`);
                
            }
        } catch (error) {
            log(["ATTACHMENTS"], error, true)
        }
    }
    return ` Attached data:\n ${attachmentTexts.join('\n')}`;
}