import { CODE_JEANS_CATEGORY, CODE_JEANS_CHANNEL } from "../constants/codeJeans.js";
import { handleAskHanni } from "../handler/messages/askHanniHandler.js";
import { handleHelloHanni } from "../handler/messages/helloHanniHandler.js";

export function messageRouter(msg) {
    if (msg.channel.id === CODE_JEANS_CHANNEL.get('ask-hanni')) { handleAskHanni(msg) }
    else if (msg.channel.id === CODE_JEANS_CHANNEL.get('hello-hanni')) { handleHelloHanni(msg) }
}