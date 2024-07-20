import { groqSendChat } from "../../api/groqAI/groqAIHandler.js";
import { helloHanniConversation, helloHanniPrivateConversation, mircaleConversation } from "../../api/groqAI/groqAIPrompt.js";
import { CODE_JEANS_SERVER, isAdminById } from "../../constants/codeJeans.js";
import { EXTERNAL_CHANNEL } from "../../constants/externalCommunity.js";
import { clearChannel } from "../common/channelHandler.js";
import { handleReply, handleSend } from "../common/messageHandler.js";


// MARK: CodeJeans

export function handleHelloHanni(msg, isPrivate = false) {
    if (msg.content.startsWith("hanni --") && isAdminById(msg.author.id) && msg.guild.id === CODE_JEANS_SERVER) {
        handleCommand(msg, getConversationList(isPrivate, false));
    } else {
        groqSendChat(msg.author.globalName, msg.content, msg.attachments, getConversationList(isPrivate)).then((replyContent) => {
            handleReply(msg, replyContent);
        });
    } 
}

function getConversationList(isPrivate) {
    return isPrivate ? helloHanniPrivateConversation : helloHanniConversation
}


// MARK: External
export function handleExternalHelloHanni(msg) {
    if (msg.content.startsWith("hanni --") && isAdminById(msg.author.id)) {
        handleCommand(msg, getExternalConversationList(msg.channel.id), getExternalServerName(msg.channel.id));
    } else {
        groqSendChat(msg.author.globalName, msg.content, msg.attachments, getExternalConversationList(msg.channel.id), getExternalServerName(msg.channel.id)).then((replyContent) => {
            handleReply(msg, replyContent);
        });
    } 
}

function getExternalConversationList(channelId) {
    switch (channelId) {
        case EXTERNAL_CHANNEL.get('miracle.hello-hanni').id:
            return mircaleConversation
    
        default:
            return null
    }
}

function getExternalServerName(channelId) {
    switch (channelId) {
        case EXTERNAL_CHANNEL.get('miracle.hello-hanni').id:
            return EXTERNAL_CHANNEL.get('miracle.hello-hanni').name
    
        default:
            return null
    }
}


// MARK: Helper

function handleCommand(msg, conversation, guildName = 'CodeJeans') {
    switch (msg.content.substring(8).trim()) {
        case "start":
            conversation.value = [];
            clearChannel(msg.channel)
                .then(() => {
                    return groqSendChat(msg.author.globalName, null, null, conversation, guildName)
                })
                .then((replyContent) => {
                    handleSend(msg, replyContent);
                });
            break;
        
        case "reset":
            conversation.value = [];
            groqSendChat(msg.author.globalName, null, null, conversation, guildName).then((replyContent) => {
                handleSend(msg, replyContent);
            });
            break;

        case "clear":
            conversation.value = [];
            clearChannel(msg.channel);
            break;

        default:
            groqSendChat(msg.author.globalName, "hanni --help", null, conversation, guildName).then((replyContent) => {
                handleReply(msg, replyContent);
            });
            break;
    }
}