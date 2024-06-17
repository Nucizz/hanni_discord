import Discord from 'discord.js';
import { config as envConfig } from "dotenv";
import { Intents } from './src/constants/intents.js';
import { handleMessage } from './src/handler/messageHandler.js';
import { HANNI_USER_ID } from './src/constants/hanni.js';


// MARK: Runtime Variable
var messageHandledCount = 0;


// MARK: Setup Helper

envConfig();


// MARK: Setup Discord Bot Client

const client = new Discord.Client({
    intents: Intents
});


// MARK: Discord Bot Functions

client.on("ready", () => {
    console.clear();
    console.log(`[START] ${client.user.tag} is now online.`);
});

client.on("messageCreate", (msg) => {
    if (msg.author.id !== HANNI_USER_ID) {
        handleMessage(msg);
        messageHandledCount++;
    }
});

client.login(process.env.DISCORD_TOKEN)