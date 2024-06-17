import { groqNewChat, groqSendChat } from "../../api/groqAI/groqAIHandler.js";
import { askHanniConversation } from "../../api/groqAI/groqAIPrompt.js";
import { clearChannel } from "../common/channelHandler.js";
import { handleReply } from "../common/messageHandler.js";

export function handleAskHanni(msg) {
    if (msg.content.startsWith("hanni --reset") || msg.content.startsWith("hanni --start")) {
        return groqNewChat(askHanniConversation).then((replyContent) => {
            handleReply(msg, replyContent);
        });
    } else if (msg.content.startsWith("hanni --clear")) {
        askHanniConversation.value = []
        clearChannel(msg.channel).then(() => { return });
    } else {
        return groqSendChat(msg.author.globalname, msg.content, msg.attachments, askHanniConversation).then((replyContent) => {
            handleReply(msg, replyContent);
        });
    }
}