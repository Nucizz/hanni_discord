import axios from "axios";
import { getConversationHistory, pushConversationMessage } from "../../constants/conversation.js";
import { log } from "../../helper/loggerHelper.js";
import { handleSongPlayerCommand } from "../voices/songPlayerHandler.js";
import { handleReply, handleSend } from "../common/messageHandler.js";
import { AI_CONVERSATION_ROLE, handleConversation } from "../ai/aiHandler.js";

export async function handleHelloHanni(message) {
    try {
        const conversation = await getConversationHistory(message.channel.id);
        
        await pushConversationMessage(
            message.channel.id, 
            message.author.username, 
            AI_CONVERSATION_ROLE.user, 
            message.content + await handleAttachment(message.attachments)
        );

        const answer = await handleConversation(conversation);
        await pushConversationMessage(message.channel.id, AI_CONVERSATION_ROLE.assistant, AI_CONVERSATION_ROLE.assistant, answer);
        
        await handleAnswer(answer, message);
    } catch (error) {
        log(["CONVERSATION", "EXTERNAL"], error, true);
    }
}

export async function handleHelloHanniFromSystem(content, channelId, needReply = false) {
    try {
        const conversation = await getConversationHistory(channelId);
        
        await pushConversationMessage(
            channelId, 
            AI_CONVERSATION_ROLE.system,
            AI_CONVERSATION_ROLE.system, 
            `${content}`
        );

        if (needReply) {
            const answer = await handleConversation(conversation);
            await pushConversationMessage(channelId, AI_CONVERSATION_ROLE.assistant, AI_CONVERSATION_ROLE.assistant, answer);
            handleSend(channelId, answer);
        }
    } catch (error) {
        log(["CONVERSATION", "INTERNAL"], error, true);
    }
}

async function handleAnswer(answer, message) {
    try {
        if (answer.startsWith("JS--")) {
            const commandResponse = await handleCommand(answer.replace(/JS--/g, ""), message);
            if (commandResponse) await handleCommandResponse(commandResponse, message);
        } else {
            handleReply(message, answer);
        }
    } catch (error) {
        log(["CONVERSATION", "COMMAND"], error, true);
    }
}

async function handleCommandResponse(response, message) {
    const conversation = await getConversationHistory(message.channel.id);

    await pushConversationMessage(
        message.channel.id, 
        AI_CONVERSATION_ROLE.system, 
        AI_CONVERSATION_ROLE.system, 
        response
    );

    const commandAnswer = await handleConversation(conversation);
    await pushConversationMessage(
        message.channel.id, 
        AI_CONVERSATION_ROLE.assistant, 
        AI_CONVERSATION_ROLE.assistant, 
        commandAnswer
    );
    handleReply(message, commandAnswer);
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
    return attachmentTexts.length > 0 ? ` Attached data:\n ${attachmentTexts.join('\n')}` : '';
}