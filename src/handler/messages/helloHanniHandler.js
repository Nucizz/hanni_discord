import { groqNewChat, groqSendChat } from "../../api/groqAI/groqAIHandler.js";
import { helloHanniConversation } from "../../api/groqAI/groqAIPrompt.js";
import { CODE_JEANS_FOUNDER } from "../../constants/codeJeans.js";
import { clearChannel } from "../common/channelHandler.js";
import { handleReply } from "../common/messageHandler.js";

export function handleHelloHanni(msg) {
    if ((msg.content.startsWith("hanni --reset") || msg.content.startsWith("hanni --start")) 
        && (msg.author.id === CODE_JEANS_FOUNDER.get('Nuciz') || msg.author.id === CODE_JEANS_FOUNDER.get('Rico')
    )) {
        return groqNewChat(helloHanniConversation).then((replyContent) => {
            handleReply(msg, replyContent);
        });
    } else if (msg.content.startsWith("hanni --clear") 
        && (msg.author.id === CODE_JEANS_FOUNDER.get('Nuciz') || msg.author.id === CODE_JEANS_FOUNDER.get('Rico'))) {
        helloHanniConversation.value = []
        clearChannel(msg.channel).then(() => { return });
    } else {
        return groqSendChat(msg.author.globalName, msg.content, msg.attachments, helloHanniConversation).then((replyContent) => {
            handleReply(msg, replyContent);
        });
    }
}