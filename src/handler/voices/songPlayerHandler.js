import ytdl from "@distube/ytdl-core";
import { PassThrough } from 'stream';
import { downloadTrack, downloadAlbum, } from '@nechlophomeriaa/spotifydl';
import { joinVoiceChannel, VoiceConnectionStatus, entersState, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { log } from "../../helper/loggerHelper.js";
import { handleHelloHanniFromSystem } from "../messages/helloHanniHandler.js";


// MARK: Variable
let voiceSongData = [];


// MARK: Handler
export async function handleSongPlayerCommand(command, message) {
    const voiceChannel = message.member.voice.channel;
    const guildId = message.guild.id
    let response = "Failed to find your song!"
    if (voiceChannel) {
        initVoiceSongData(guildId, voiceChannel, message.channel.id);

        if (command.startsWith("play ")) {
            response = await handleSongPlay(command.replace(/play /g, ""), voiceChannel);

        } else if (command.startsWith("queue ")) {
            response = await handleSongQueue(command.replace(/queue /g, ""), voiceChannel);

        } else if (command == "stop") {
            response = handleSongStop(guildId);

        } else if (command == "skip") {
            response = handleSongSkip(guildId);

        }else {
            response = "Your command is undefined, please use [JS--song.play, JS--song.queue, JS--song.stop]."
        }
    } else {
        response = "Unable to proceed, user must join a voice channel first!"
    }

    log(["MUSIC", "CALLBACK"], response);
    handleHelloHanniFromSystem(response, message.channel.id, true);
}

function initVoiceSongData(guildId, voiceChannel, textChannelId) {
    const existingData = voiceSongData.find(guild => guild.id === guildId);
    if (!existingData) {
        voiceSongData.push({
            id: guildId,
            voiceChannel: voiceChannel,
            textChannelId: textChannelId,
            queueList: [],
            connection: null,
            player: null
        });
    }
}

function popVoiceSongData(guildId) {
    voiceSongData = voiceSongData.filter(guild => guild.id !== guildId);
}

async function handleSongPlay(query, voiceChannel) {
    const data = voiceSongData.find(guild => guild.id === voiceChannel.guild.id);
    if (data) {
        const audioStreams = await fetchAudioByQuery(query);
        if (audioStreams.length > 0) {
            data.queueList = [...audioStreams];
            playVoice(voiceChannel);
            return `Successfully played ${query}!`
        }
    }

    return `Failed to play ${query}!`
}

async function handleSongQueue(query, voiceChannel) {
    const data = voiceSongData.find(guild => guild.id === voiceChannel.guild.id);
    if (data) {
        const audioStreams = await fetchAudioByQuery(query);
        if (audioStreams.length > 0) {
            data.queueList = [...data.queueList, ...audioStreams];

            if (!voiceSongData.find(guild => guild.id === voiceChannel.guild.id).player) playVoice(voiceChannel);
            return `Successfully queued ${query}!`
        }
    }

    return `Failed to queue ${query}!`
}

function handleSongStop(guildId) {
    const data = voiceSongData.find(guild => guild.id === guildId);
    if (data) {
        data.connection.destroy();
        popVoiceSongData(guildId);
        return "Succesfully stopped playing song!"
    }

    return "Failed to stop current playing song!"
}

function handleSongSkip(guildId) {
    const data = voiceSongData.find(guild => guild.id === guildId);
    if (data) {
        data.queueList.shift();

        if (data.player && data.player.state.status === AudioPlayerStatus.Playing) {
            data.player.stop();
        }

        if (data.queueList.length > 0) {
            playNextSong(data);
        }
        
        return "Succesfully skipped current playing song!"
    }

    return "Failed to skip current playing song!"
}


// MARK: Discord
async function playVoice(voiceChannel) {
    const data = voiceSongData.find(guild => guild.id === voiceChannel.guild.id);

    data.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    log(["VOICE", "MUSIC"], `Joined voice channel of ${voiceChannel.guild.id}`);

    data.connection.on('error', error => {
        handleHelloHanniFromSystem("There was an error while playing song.", data.textChannelId, true);
        log(["VOICE", "MUSIC"], error, true);
        data.connection.destroy();
        popVoiceSongData(voiceChannel.guild.id);
    });

    data.connection.on('disconnect', () => {
        handleHelloHanniFromSystem("Disconnected from the voice channel.", data.textChannelId, true);
        log(["VOICE", "MUSIC"], "Disconnected from the voice channel.", true);
        data.connection.destroy();
        popVoiceSongData(voiceChannel.guild.id);
    });

    await entersState(data.connection, VoiceConnectionStatus.Ready, 30e3);
    data.player = createAudioPlayer();
    data.connection.subscribe(data.player);

    const playNextSong = async () => {
        if (data.queueList.length === 0) {
            handleHelloHanniFromSystem("Finished playing the song/queue.", data.textChannelId);
            log(["MUSIC", "VOICE"], "Finished playing the song/queue.");
            data.connection.destroy();
            data.connection = null;
            data.player = null;
            return;
        }

        const nextTrack = data.queueList.shift();
        if (!nextTrack || !nextTrack.buffer) {
            handleHelloHanniFromSystem(`Failed to play song: ${nextTrack.name ?? "Undefined"}`, data.textChannelId, true);
            log(["MUSIC", "VOICE"], `Failed to play song: ${nextTrack.name ?? "Undefined"}`, true);
            return playNextSong();
        }

        const resource = createAudioResource(nextTrack.buffer);
        data.player.play(resource);

        try {
            await new Promise((resolve, reject) => {
                const queueStatus = data.queueList.map((song, index) => `${index + 1}. ${song.name}`).join('\n');
                const queueStatusText = queueStatus ? ` with queue of:\n${queueStatus}` : "";
                handleHelloHanniFromSystem(`Playing song: ${nextTrack.name}${queueStatusText}`, data.textChannelId);
                log(["VOICE", "MUSIC"], `Playing song: ${nextTrack.name}${queueStatusText}`);

                data.player.once(AudioPlayerStatus.Idle, resolve);
                data.player.once('error', reject);
            });
            playNextSong();
        } catch (error) {
            handleHelloHanniFromSystem(`Failed to play song: ${nextTrack.name ?? "Undefined"}`, data.textChannelId, true);
            log(["VOICE", "MUSIC"], `Player error: ${error}`, true);
            playNextSong();
        }
    };

    await playNextSong();
}


// MARK: Audio
async function fetchAudioByQuery(query) {
    const youtubeVideoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)[^&=%\?]{11}/;
    const spotifyTrackRegex = /^(https?:\/\/)?(open\.)?spotify\.com\/track\/[a-zA-Z0-9]+(?:\?si=[a-zA-Z0-9]+)?$/;
    const spotifyPlaylistRegex = /^(https?:\/\/)?(open\.)?spotify\.com\/playlist\/[a-zA-Z0-9]+(?:\?si=[a-zA-Z0-9]+)?$/;
    let audioStreams = [];

    if (youtubeVideoRegex.test(query)) {
        const stream = generateYoutubeAudio(query);
        if (stream) audioStreams.push(stream);

    } else if (spotifyTrackRegex.test(query)) {
        const stream = await generateSpotifyTrackAudio(query);
        if (stream) audioStreams.push(stream);

    } else if (spotifyPlaylistRegex.test(query)) {
        const streams = await generateSpotifyPlaylistAudio(query);
        if (streams) audioStreams = [...streams];

    } else { // TEXT
        const stream = await generateSpotifyTrackAudio(query);
        if (stream) audioStreams.push(stream);
    }

    return audioStreams;   
}

function generateYoutubeAudio(url) {
    log(["VOICE", "MUSIC", "YOUTUBE"], `Fetching song ${url} from Youtube`);
    return {
        name: url,
        buffer: ytdl(url, {
            filter: "audioonly",
            quality: "lowestaudio"
        })
    };
}

async function generateSpotifyTrackAudio(url) {
    log(["VOICE", "MUSIC", "SPOTIFY"], `Fetching song ${url} from Spotify`);
    try {
        const trackData = await downloadTrack(url);
        if (!trackData || !trackData.audioBuffer) {
            return null;
        }
        const audioStream = new PassThrough();
        audioStream.end(trackData.audioBuffer);
        return {
            name: url,
            buffer: audioStream
        };
    } catch (error) {
        log(["VOICE", "MUSIC", "SPOTIFY"], error, true);
        return null;
    }
}

async function generateSpotifyPlaylistAudio(url) {
    log(["VOICE", "MUSIC", "SPOTIFY"], `Fetching song ${url} from Spotify`);
    try {
        const albumData = await downloadAlbum(url);
        if (!albumData || !albumData.trackList) {
            return null;
        }

        const audioStreams = albumData.trackList.map(track => {
            if (track.success && track.audioBuffer) {
                const stream = new PassThrough();
                stream.end(track.audioBuffer);
                return {
                    name: url,
                    buffer: stream
                };
            } else {
                return null;
            }
        }).filter(stream => stream !== null);

        return audioStreams;
    } catch (error) {
        log(["VOICE", "MUSIC", "SPOTIFY"], error, true);
        return null;
    }
}