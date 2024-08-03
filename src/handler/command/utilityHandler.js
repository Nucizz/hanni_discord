import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { clearChannel } from "../common/channelHandler.js";
import { sendGeminiPrompt } from "../../api/gemini/geminiChat.js";
import { discordClient } from "../../api/discord/discordConfig.js";
import { config as envConfig } from "dotenv";


// MARK: Config
envConfig();


// MARK: Handler
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
            try {
                if (!interaction.channel.isTextBased()) {
                    await interaction.reply({ content: 'This command can only be used in text channels.', ephemeral: true });
                    return;
                } else {
                    await interaction.reply({ content: '**Start clearing messages now...**', ephemeral: true });
                    await clearChannel(interaction.channel);
                    await interaction.deleteReply();
                }
            } catch {
                await interaction.reply({ content: 'This command can only be used in guild server.', ephemeral: true });
                return;
            }
        }
    },
    {
        command: new SlashCommandBuilder()
            .setName('direct')
            .setDescription('Direct message someone.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .setNSFW(true)
            .addStringOption(option => 
                option
                    .setName('target_id')
                    .setDescription('Target user id.')
                    .setRequired(true)
            )
            .addStringOption(option => 
                option
                    .setName('content')
                    .setDescription('Content to send.')
                    .setRequired(true)
            )
            .addBooleanOption(option => 
                option
                    .setName('enhance')
                    .setDescription('Enhance using Gemini by Google.')
            ),
        action: async (interaction) => {
            const targetId = interaction.options.getString('target_id');
            const content = interaction.options.getString('content');
            const enhance = interaction.options.getBoolean('enhance') ?? false;

            if (interaction.user.id != process.env.DISCORD_MASTER_ID) {
                await interaction.reply({ content: `You don't have access!`, ephemeral: true });
                return;
            }

            await interaction.deferReply();
            try {
                const target = discordClient.users.cache.get(targetId);

                if (enhance) {
                    const enhancedContent = await sendGeminiPrompt(content);
                    await discordClient.users.send(targetId, enhancedContent);
                    await interaction.editReply({ content: `Message sent to ${target?.displayName ?? targetId} with content of\n\`\`\`${enhancedContent}\`\`\``, ephemeral: true });
                } else {
                    await discordClient.users.send(targetId, content);
                    await interaction.editReply({ content: `Message sent to ${target?.displayName ?? targetId}.`, ephemeral: true });
                }
            } catch (error) {
                await interaction.editReply({ content: `Failed to send message with error of\n\`\`\`${error}\`\`\``, ephemeral: true });
            }
        }
    }
]