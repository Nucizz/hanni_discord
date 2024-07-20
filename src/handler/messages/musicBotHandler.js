import { client } from "../../../index.js";
import { EXTERNAL_SERVER } from "../../constants/externalCommunity.js";
import { handleReply } from "../common/messageHandler.js";
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from '@discordjs/voice';


export function playPlaylist(guildName, command, msg) {
    const channelId = getMusicCommandChannelId(guildName);
    const voiceChannel = msg.member.voice.channel;

    if (channelId && voiceChannel) {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        connection.on('error', error => {
            console.error(`[MUSIC][VOICE] ${error}`);
            handleReply(msg, "An error occurred while trying to join the voice channel.");
        });

        entersState(connection, VoiceConnectionStatus.Ready, 30e3)
            .then(() => {
                return client.channels.cache.get(channelId).send(command);
            })
            .then(() => {
                handleReply(msg, "Playing now!");

                // Disconnect after 2 seconds for allowing command to be verified
                setTimeout(() => {
                    connection.destroy();
                }, 2000);
            })
            .catch(error => {
                console.error(`[MUSIC][VOICE] ${error}`);
                handleReply(msg, "I couldn't join the voice channel.");
            });
    } else if (!voiceChannel) {
        handleReply(msg, "You need to join a voice channel first!");
    } else {
        handleReply(msg, "I can't command your music bot in this server.");
    }
}

function getMusicCommandChannelId(guildName) {
    switch (guildName) {
        case EXTERNAL_SERVER.get("miracle").name:
            return EXTERNAL_SERVER.get("miracle").channel.get("music-bot");
    
        default:
            return null;
    }
}