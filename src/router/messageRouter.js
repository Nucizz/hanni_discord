import { Community } from "../constants/remoteConfig.js";
import { handleHelloHanni } from "../handler/messages/helloHanniHandler.js";
import { log } from "../helper/loggerHelper.js";

export function routeMessage(message) {
    try {
        const handleType = Community.getChannelHandleTypeByChannelId(message.channel.id) ?? 'none';

        if (!handleType) {
            log(["ROUTER", "MESSAGE"], `Cant find channel ${message.channel.id} in config.`, true);
            return;
        }
    
        switch (handleType) {
            case 'hello-hanni':
                handleHelloHanni(message).then(() => {
                    log(["ROUTER", "MESSAGE", "HELLO_HANNI"], `Handling message from ${message.channel.id}.`);
                });
                break;
    
            case 'none':
                log(["ROUTER", "MESSAGE"], `Ignoring to handle message from channel ${message.channel.id}.`);
                break;
    
            default:
                log(["ROUTER", "MESSAGE"], `Unknown handle type for channel ${message.channel.id}.`, true);
        }
    } catch (error) {
        log(["ROUTER", "MESSAGE"], error, true);
    }
}