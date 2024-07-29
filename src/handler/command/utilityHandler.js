import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { clearChannel } from "../common/channelHandler.js";

export const utilityCommands = [
    {
        command: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!'),
        action: async (interaction) => {
            await interaction.reply({ content: 'Pong!', ephemeral: true });
        }
    },
    {
        command: new SlashCommandBuilder()
            .setName('clear_chat')
            .setDescription('Clears the chat room.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        action: async (interaction) => {
            if (!interaction.channel.isTextBased()) {
                await interaction.reply({ content: 'This command can only be used in text channels.', ephemeral: true });
                return;
            }

            await interaction.reply({ content: '**Start clearing messages now...**', ephemeral: true });
            await clearChannel(interaction.channel);
            await interaction.deleteReply();
        }
    }
]