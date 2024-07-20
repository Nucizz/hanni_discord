import { CODE_JEANS_SERVER, CODE_JEANS_CHANNEL } from "../constants/codeJeans.js";
import { EXTERNAL_CHANNEL } from "../constants/externalCommunity.js";
import { handleExternalHelloHanni, handleHelloHanni } from "../handler/messages/helloHanniHandler.js";

export function messageRouter(msg) {
    msg.guild.id === CODE_JEANS_SERVER ? 
        codeJeansRouter(msg) : handleExternalHelloHanni(msg);
}

function codeJeansRouter(msg) {
    switch (msg.channel.id) {
        case CODE_JEANS_CHANNEL.get('hello-hanni-private'): 
            handleHelloHanni(msg, true);
            break;

        case CODE_JEANS_CHANNEL.get('hello-hanni'): 
            handleHelloHanni(msg);
            break;
    
        default:
            break;
    }
}