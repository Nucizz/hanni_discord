import ytdl from "@distube/ytdl-core";
import { PassThrough } from 'stream';
import { downloadTrack, downloadAlbum, } from '@nechlophomeriaa/spotifydl';
import { joinVoiceChannel, VoiceConnectionStatus, entersState, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { log } from "../../helper/logger.js";


// MARK: Variable
let voiceSongData = [];


// MARK: Handler
export async function handleSongPlayerCommand(command, message) {
    const voiceChannel = message.member.voice.channel;
    const guildId = message.guild.id
    if (voiceChannel) {
        initVoiceSongData(guildId, voiceChannel);

        if (command.startsWith("play ")) {
            return await handleSongPlay(command.replace(/play /g, ""), voiceChannel);

        } else if (command.startsWith("queue ")) {
            return await handleSongQueue(command.replace(/queue /g, ""), voiceChannel);

        } else if (command == "stop") {
            return handleSongStop(guildId);

        } else {
            return "Your command is undefined, please use [JS--song.play, JS--song.queue, JS--song.stop]."
        }
    } else {
        return "Unable to proceed, user must join a voice channel first!"
    }
}

function initVoiceSongData(guildId, voiceChannel) {
    const existingData = voiceSongData.find(guild => guild.id === guildId);
    if (!existingData) {
        voiceSongData.push({
            id: guildId,
            voiceChannel: voiceChannel,
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
        data.queueList = [...await fetchAudioByQuery(query)];
        playVoice(voiceChannel);
        return `Successfully played ${query}!`
    } else {
        return `Failed to play ${query}!`
    }
}

async function handleSongQueue(query, voiceChannel) {
    const data = voiceSongData.find(guild => guild.id === voiceChannel.guild.id);
    if (data) {
        data.queueList = [...data.queueList, ...await fetchAudioByQuery(query)];

        if (!voiceSongData.find(guild => guild.id === voiceChannel.guild.id).player) {
            playVoice(voiceChannel);
        }
        return `Successfully queued ${query}!`
    } else {
        return `Failed to queue ${query}!`
    }
}

function handleSongStop(guildId) {
    voiceSongData.find(guild => guild.id === guildId).connection.destroy();
    popVoiceSongData(guildId);
    return "Succesfully stopped playing song!"
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
        log(["VOICE", "MUSIC"], error, true);
        data.connection.destroy();
        data.connection = null;
        data.player = null;
    });

    await entersState(data.connection, VoiceConnectionStatus.Ready, 30e3);
    data.player = createAudioPlayer();
    data.connection.subscribe(data.player);

    const playNextSong = async () => {
        if (data.queueList.length === 0) {
            log(["MUSIC", "VOICE"], `Tried to play an empty queue!`, true);
            data.connection.destroy();
            data.connection = null;
            data.player = null;
            return;
        }

        console.log(data.queueList)

        const nextTrack = data.queueList.shift();
        if (!nextTrack) {
            log(["MUSIC", "VOICE"], `Invalid track: ${nextTrack}`, true);
            return playNextSong();
        }

        const resource = createAudioResource(nextTrack);
        data.player.play(resource);

        try {
            await new Promise((resolve, reject) => {
                log(["VOICE", "MUSIC"], `Playing next song.`);
                data.player.once(AudioPlayerStatus.Idle, resolve);
                data.player.once('error', reject);
            });
            playNextSong();
        } catch (error) {
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
    let audioStream = null;

    if (youtubeVideoRegex.test(query)) {
        audioStream = [generateYoutubeAudio(query)];
    } else if (spotifyTrackRegex.test(query)) {
        audioStream = [await generateSpotifyTrackAudio(query)];
    } else if (spotifyPlaylistRegex.test(query)) {
        audioStream = await generateSpotifyPlaylistAudio(query);
    } else { // TEXT
        audioStream = [await generateSpotifyTrackAudio(query)];
    }

    return [...audioStream];   
}

function generateYoutubeAudio(url) {
    log(["VOICE", "MUSIC", "YOUTUBE"], `Fetching song ${url} from Youtube`);
    return ytdl(url, {
        filter: "audioonly",
        quality: "lowestaudio"
    });
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
        return audioStream;
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
    } catch (error) {
        log(["VOICE", "MUSIC", "SPOTIFY"], error, true);
        return [];
    }
}