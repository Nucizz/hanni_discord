import { discordClient } from "../../api/discord/discordConfig.js";


// MARK: Static
const DISCORD_MAX_LENGTH = 2000


// MARK: Handler
export function handleReply(message, content) {
    content = content.toString();
    let start = 0;
    while (start < content.length) {
        const end = findCutIndex(content, start, DISCORD_MAX_LENGTH);
        message.reply(content.substring(start, end).trim());
        start = end;
    }
}

export function handleSend(channelId, content) {
    content = content.toString();
    let start = 0;
    while (start < content.length) {
        const end = findCutIndex(content, start, DISCORD_MAX_LENGTH);
        discordClient.channels.cache.get(channelId).send(content.substring(start, end).trim());
        start = end;
    }
}


// MARK: Helper
function findCutIndex(content, start, maxLength) {
    const end = start + maxLength;
    if (end >= content.length) return content.length;

    let cutIndex = content.lastIndexOf('.', end);
    if (cutIndex === -1 || cutIndex < start) {
        cutIndex = content.lastIndexOf('\n', end);
    }
    if (cutIndex === -1 || cutIndex < start) {
        cutIndex = end;
    }

    return cutIndex + 1;
}