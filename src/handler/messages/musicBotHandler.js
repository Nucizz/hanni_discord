import ytdl from "@distube/ytdl-core";
import { handleReply } from "../common/messageHandler.js";
import { PassThrough } from 'stream';
import { downloadTrack2, downloadAlbum2, } from '@nechlophomeriaa/spotifydl';
import { joinVoiceChannel, VoiceConnectionStatus, entersState, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';


// MARK: Variable

let currentConnection = null;
let currentPlayer = null;


// MARK: Method

export function isPlayCommand(response) {
    return response.startsWith("--play") || response.startsWith("--stop");
}

export function handleMusicBotCommand(command, msg) {
    const voiceChannel = msg.member.voice.channel;

    if (voiceChannel) {
        if (command.startsWith("--play")) {
            playQueue(command.replace(/--play /g, ""), msg, voiceChannel);
        } else if (command.startsWith("--stop")) {
            stopQueue(msg);
        }
    } else {
        handleReply(msg, "You need to join a voice channel first, then you can tell me to play it again!");
    }
}

function playQueue(url, msg, voiceChannel) {
    handleReply(msg, "Hold up while I'm looking for your songs, gonna start playing when I'm ready!");

    queueByType(url)
        .then(async (queue) => {
            if (!queue || queue.length <= 0) {
                handleReply("Oops, couldn't find what you wanted :(");
                return;
            }

            currentConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
    
            currentConnection.on('error', error => {
                console.error(`[MUSIC][VOICE] ${error}`);
                handleReply(msg, "I can't join your voice channel :(");
                cleanup();
            });
    
            try {
                await entersState(currentConnection, VoiceConnectionStatus.Ready, 30e3);
                handleReply(msg, "Playing now!");

                currentPlayer = createAudioPlayer();
                currentConnection.subscribe(currentPlayer);

                console.log("Added songs queue of", queue.length);

                for (let i = 0; i < queue.length; i++) {
                    console.log("Playing songs of", i + 1);
                    const resource = createAudioResource(queue[i]);
                    currentPlayer.play(resource);
    
                    await new Promise((resolve, reject) => {
                        currentPlayer.once(AudioPlayerStatus.Idle, resolve);
                        currentPlayer.once('error', reject);
                    });
                }

                cleanup();
            } catch (error) {
                console.error(`[MUSIC][VOICE] ${error}`);
                handleReply(msg, "Ouch, I can't sing no more!");
                cleanup();
            }
        });
}

function stopQueue(msg) {
    if (currentPlayer) {
        currentPlayer.stop();
        handleReply(msg, "Stopped playing.");
    }
    if (currentConnection) {
        currentConnection.destroy();
    }
    cleanup();
}


// MARK: Helper

function generateYoutubeAudio(url) {
    return ytdl(url, {
        filter: "audioonly",
        quality: "lowestaudio"
    });
}

async function generateSpotifyAudio(url) {
    try {
        const trackData = await downloadTrack2(url);
        if (!trackData || !trackData.audioBuffer) {
            return null;
        }
        const audioStream = new PassThrough();
        audioStream.end(trackData.audioBuffer);
        return audioStream;
    } catch {
        return null
    }
}

async function generateSpotifyPlaylist(url) {
    try {
        const albumData = await downloadAlbum2(url);
        if (!albumData || !albumData.trackList) {
            return [];
        }

        const audioStreams = albumData.trackList.map(track => {
            if (track.success && track.audioBuffer) {
                const stream = new PassThrough();
                stream.end(track.audioBuffer);
                return stream;
            } else {
                return null;
            }
        }).filter(stream => stream !== null);

        return audioStreams;
    } catch {
        return [];
    }
}

async function queueByType(url) {
    const youtubeVideoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)[^&=%\?]{11}/;
    const spotifySongRegex = /^(https?:\/\/)?(open\.)?spotify\.com\/track\/[a-zA-Z0-9]+(?:\?si=[a-zA-Z0-9]+)?$/;
    const spotifyPlaylistRegex = /^(https?:\/\/)?(open\.)?spotify\.com\/playlist\/[a-zA-Z0-9]+(?:\?si=[a-zA-Z0-9]+)?$/;

    if (youtubeVideoRegex.test(url)) {
        return [generateYoutubeAudio(url)];
    } else if (spotifySongRegex.test(url)) {
        return [await generateSpotifyAudio(url)];
    } else if (spotifyPlaylistRegex.test(url)) {
        return await generateSpotifyPlaylist(url);
    } else { // TEXT
        return [await generateSpotifyAudio(url)];
    }
}

function cleanup() {
    if (currentPlayer) {
        currentPlayer.stop();
        currentPlayer = null;
    }
    if (currentConnection) {
        currentConnection.destroy();
        currentConnection = null;
    }
}