import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config as envConfig } from 'dotenv';
import { log } from '../../helper/loggerHelper.js';
import { commandList } from '../../router/commandRouter.js';

envConfig();

export async function initDiscordCommand() {
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    if (!Array.isArray(commandList) || commandList.length === 0) {
        log(["START", "DISCORD", "COMMAND"], "No commands to upload.", true);
        return;
    }

    const commandsJson = commandList.map(cmd => cmd.command.toJSON());

    rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
        body: commandsJson,
    })
    .then(() => {
        log(["START", "DISCORD", "COMMAND"], "Uploaded application commands to Discord server.");
    })
    .catch(error => {
        log(["START", "DISCORD", "COMMAND"], `Error uploading commands: ${error.message}`, true);
    });
}