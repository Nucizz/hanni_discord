import Discord from 'discord.js';
import { config as envConfig } from "dotenv";
import { log } from '../../helper/loggerHelper.js';
import { routeMessage } from '../../router/messageRouter.js';
import { routeCommand } from '../../router/commandRouter.js';
import { initDiscordCommand } from './discordCommand.js';


// MARK: Config
envConfig();
const Intents = [
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


// MARK: Service
export const discordClient = new Discord.Client({
    intents: Intents
});

export function initDiscordSocket() {
    log(["START", "DISCORD", "CLIENT"], "Try to log on to discord bot.");
    discordClient.login(process.env.DISCORD_TOKEN);
}

discordClient.on("ready", async () => {
    log(["DISCORD", "CLIENT", "READY"], `${discordClient.user.tag} is now online.`);
    await initDiscordCommand();
});

discordClient.on("messageCreate", (msg) => {
    if (!msg.author.bot) {
        log(["DISCORD", "CLIENT", "MESSAGE"], `User ${msg.author.username} sent a message.`);
        routeMessage(msg);
    }
});

discordClient.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        routeCommand(interaction);
    }
});