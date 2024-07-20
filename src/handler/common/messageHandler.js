const DISCORD_MAX_LENGTH = 2000

export function handleReply(msg, content) {
    content = content.toString()
    let start = 0;
    let end = DISCORD_MAX_LENGTH;
    while (start < content.length) {
        msg.reply(content.substring(start, end));
        start = end;
        end += DISCORD_MAX_LENGTH;
    }
}

export function handleSend(msg, content) {
    content = content.toString()
    let start = 0;
    let end = DISCORD_MAX_LENGTH;
    while (start < content.length) {
        msg.channel.send(content.substring(start, end));
        start = end;
        end += DISCORD_MAX_LENGTH;
    }
}