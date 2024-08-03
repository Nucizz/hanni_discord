import { discordClient } from "../api/discord/discordConfig.js";
import { Community } from "../constants/remoteConfig.js";
import { handleHelloHanni } from "../handler/messages/helloHanniHandler.js";
import { log } from "../helper/loggerHelper.js";
import { config as envConfig } from "dotenv";


// MARK: Config
envConfig();


// MARK: Handler
export function routeMessage(message) {
    try {
        const handleType = Community.getChannelHandleTypeByChannelId(message.channel.id) ?? 'none';
    
        switch (handleType) {
            case 'hello-hanni':
                handleHelloHanni(message)
                break;
    
            case 'none':
                log(["ROUTER", "MESSAGE"], `Ignoring to handle message from channel ${message.channel.id}.`);
                break;
    
            default:
                log(["ROUTER", "MESSAGE"], `Unknown handle type for channel ${message.channel.id}.`, true);
        }
    } catch (error) {
        reportUnhandledMessage(message);
        log(["ROUTER", "MESSAGE"], error, true);
    }
}

async function reportUnhandledMessage(message) {
    const target = discordClient.users.cache.get(process.env.DISCORD_MASTER_ID);
    const content = [
        `Author  : ${message.author.id}`,
        `Channel : ${message.channel.id}`,
        `Guild   : ${message.guild ? message.guild.id : "NULL"}`,
        `Content : ${message.content}`
    ]

    await target.send(`\`\`\`${content.join('\n')}\`\`\``);
}