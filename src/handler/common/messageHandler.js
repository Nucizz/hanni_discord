import { discordClient } from "../../api/discord/discordConfig.js";

const DISCORD_MAX_LENGTH = 2000

export function handleReply(message, content) {
    content = content.toString()
    let start = 0;
    let end = DISCORD_MAX_LENGTH;
    while (start < content.length) {
        message.reply(content.substring(start, end));
        start = end;
        end += DISCORD_MAX_LENGTH;
    }
}

export function handleSend(channelId, content) {
    content = content.toString()
    let start = 0;
    let end = DISCORD_MAX_LENGTH;
    while (start < content.length) {
        discordClient.channels.cache.get(channelId).send(content.substring(start, end));
        start = end;
        end += DISCORD_MAX_LENGTH;
    }
}