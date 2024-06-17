import { groqNewChat, groqSendChat } from "../../api/groqAI/groqAIHandler.js";
import { helloHanniConversation } from "../../api/groqAI/groqAIPrompt.js";
import { CODE_JEANS_FOUNDER } from "../../constants/codeJeans.js";
import { clearChannel } from "../channelHandler.js";

export function handleHelloHanni(msg) {
    if ((msg.content.startsWith("hanni --reset") || msg.content.startsWith("hanni --start")) 
        && (msg.author.id === CODE_JEANS_FOUNDER.get('Nuciz') || msg.author.id === CODE_JEANS_FOUNDER.get('Rico')
    )) {
        return groqNewChat(helloHanniConversation).then((replyContent) => {
            msg.reply(replyContent);
        });
    } else if (msg.content.startsWith("hanni --clear") 
        && (msg.author.id === CODE_JEANS_FOUNDER.get('Nuciz') || msg.author.id === CODE_JEANS_FOUNDER.get('Rico'))) {
        helloHanniConversation.value = []
        clearChannel(msg.channel).then(() => { return });
    } else {
        return groqSendChat(msg.author.username, msg.content, helloHanniConversation).then((replyContent) => {
            msg.reply(replyContent);
        });
    }
}