import { groqNewChat, groqSendChat } from "../../api/groqAI/groqAIHandler.js";
import { askHanniConversation } from "../../api/groqAI/groqAIPrompt.js";
import { clearChannel } from "../channelHandler.js";

export function handleAskHanni(msg) {
    if (msg.content.startsWith("hanni --reset") || msg.content.startsWith("hanni --start")) {
        return groqNewChat(askHanniConversation).then((replyContent) => {
            msg.reply(replyContent);
        });
    } else if (msg.content.startsWith("hanni --clear")) {
        askHanniConversation.value = []
        clearChannel(msg.channel).then(() => { return });
    } else {
        return groqSendChat(msg.author.username, msg.content, askHanniConversation).then((replyContent) => {
            msg.reply(replyContent);
        });
    }
}