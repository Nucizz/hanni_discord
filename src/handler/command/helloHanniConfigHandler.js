import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { clearChannel } from "../common/channelHandler.js";
import { createNewConversation } from "../../constants/conversation.js";

export const helloHanniConfigCommands = [
    {
        command: new SlashCommandBuilder()
            .setName('new_chat')
            .setDescription('Creates a new context for Hanni chat session.')
            .setDMPermission(false)
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addBooleanOption(option => 
                option
                    .setName('clear_history')
                    .setDescription('Decides wether it should clear the exisiting chat history or not.')
            ),
        action: async (interaction) => {
            const shouldClearHistory = interaction.options.getBoolean('clear_history');

            if (shouldClearHistory ?? true) {
                await interaction.reply({ content: "**Starting new chat...**", ephemeral: true });
                await clearChannel(interaction.channel);
                await interaction.deleteReply();
            } else {
                await interaction.reply({ content: "**Chat memory has been reset.**", ephemeral: false });
            }

            await createNewConversation(interaction.channel.id);
        }
    },
]
