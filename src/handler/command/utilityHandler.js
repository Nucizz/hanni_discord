import { SlashCommandBuilder } from "discord.js";
import { clearChannel } from "../common/channelHandler.js";

export const utilityCommands = [
    {
        command: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!'),
        action: async (interaction) => {
            await interaction.reply('Pong!');
        }
    },
    {
        command: new SlashCommandBuilder()
            .setName('clear_chat')
            .setDescription('Clears the chat room.'),
        action: async (interaction) => {
            if (!interaction.channel.isTextBased()) {
                await interaction.reply('This command can only be used in text channels.');
                return;
            }

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member || !member.permissions.has('ADMINISTRATOR')) {
                await interaction.reply('You do not have the required permissions to use this command.');
                return;
            }

            await clearChannel(interaction.channel);
        }
    }
]
