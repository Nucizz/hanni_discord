import Discord from 'discord.js';

export const Intents = [
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMessages,
    Discord.IntentsBitField.Flags.GuildMessageReactions,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildEmojisAndStickers,
    Discord.IntentsBitField.Flags.GuildInvites,
    Discord.IntentsBitField.Flags.MessageContent,
    Discord.IntentsBitField.Flags.DirectMessages,
    Discord.IntentsBitField.Flags.DirectMessageReactions,
    Discord.IntentsBitField.Flags.GuildVoiceStates
];