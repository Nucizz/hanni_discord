import Discord from 'discord.js';
import { config as envConfig } from "dotenv";
import { Intents } from './src/constants/intents.js';
import { messageRouter } from './src/router/messageRouter.js';
import { HANNI_USER_ID } from './src/constants/hanni.js';
import { generateDependencyReport } from '@discordjs/voice';


// MARK: Runtime Variable

var messageHandledCount = 0;


// MARK: Setup Helper

envConfig();


// MARK: Setup Client

export const client = new Discord.Client({
    intents: Intents
});


// MARK: Discord Bot Functions

process.on('unhandledRejection', error => {
    console.clear();
	console.error('[ERROR]', error.message);
});

client.on("ready", () => {
    console.clear();
    console.log(generateDependencyReport());
    console.log(`[START] ${client.user.tag} is now online.`);
});

client.on("messageCreate", (msg) => {
    if (msg.author.id !== HANNI_USER_ID && !msg.author.bot) {
        messageRouter(msg);
        messageHandledCount++;
        console.log(`[LOG][MSG] Responds to ${msg.author.username}`)
    }
});

client.login(process.env.DISCORD_TOKEN);