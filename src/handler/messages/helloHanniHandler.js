import { groqSendChat } from "../../api/groqAI/groqAIHandler.js";
import { helloHanniConversation, helloHanniPrivateConversation, miracleConversation } from "../../api/groqAI/groqAIPrompt.js";
import { CODE_JEANS_SERVER, isAdminById } from "../../constants/codeJeans.js";
import { EXTERNAL_SERVER } from "../../constants/externalCommunity.js";
import { isPlayCommand } from "../../constants/spotify.js";
import { clearChannel } from "../common/channelHandler.js";
import { handleReply, handleSend } from "../common/messageHandler.js";
import { playPlaylist } from "./musicBotHandler.js";


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
    const guild = getExternalGuildId(msg.guild.id);
    if (msg.content.startsWith("hanni --") && isAdminById(msg.author.id)) {
        handleCommand(msg, getExternalConversationList(guild), guild.name);
    } else {
        groqSendChat(msg.author.globalName, msg.content, msg.attachments, getExternalConversationList(guild), guild.name).then((replyContent) => {
            if (isPlayCommand(replyContent)) {
                playPlaylist(guild.name, replyContent, msg);
            } else {
                handleReply(msg, replyContent);
            }
        });
    } 
}

function getExternalGuildId(guildId) {
    switch (guildId) {
        case EXTERNAL_SERVER.get('miracle').id:
            return EXTERNAL_SERVER.get('miracle')
    
        default:
            return null
    }
}

function getExternalConversationList(guild) {
    switch (guild) {
        case EXTERNAL_SERVER.get('miracle'):
            return miracleConversation
    
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