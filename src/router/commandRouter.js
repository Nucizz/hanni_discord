import { helloHanniConfigCommands } from "../handler/command/helloHanniConfigHandler.js";
import { songPlayerControlCommands } from "../handler/command/songPlayerControlHandler.js";
import { utilityCommands } from "../handler/command/utilityHandler.js";
import { log } from "../helper/loggerHelper.js";

export const commandList = [
    ...utilityCommands,
    ...helloHanniConfigCommands,
    ...songPlayerControlCommands
]

export function routeCommand(interaction) {
    const command = commandList.find(cmd => cmd.command.name === interaction.commandName);

    if (command) {
        command.action(interaction)
            .then(() => {
                log(["ROUTER", "COMMAND"], `Executed command ${interaction.commandName}`);
            })
            .catch(async (error) => {
                log(["ROUTER", "COMMAND"], error, true);
                await interaction.reply('There was an error while executing this command!');
            })
    } else {
        interaction.reply('Unknown command!')
            .then(() => {
                log(["ROUTER", "COMMAND"], `Unknown command ${interaction.commandName} was called`, true);
            })
            .catch(async (error) => {
                log(["ROUTER", "COMMAND"], error, true);
            })
    }
}