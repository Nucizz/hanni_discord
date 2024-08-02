import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { handleSongPlayerCommand } from "../voices/songPlayerHandler.js";
import { Community } from "../../constants/remoteConfig.js";

export const songPlayerControlCommands = [
    {
        command: new SlashCommandBuilder()
            .setName('play')
            .setDescription('Play something for you in a voice channel.')
            .setDMPermission(false)
            .setDefaultMemberPermissions(PermissionFlagsBits.DeafenMembers | PermissionFlagsBits.Administrator)
            .addStringOption(option => 
                option
                    .setName('query')
                    .setDescription('You can add song title or links. (Only supports Spotify and Youtube)')
                    .setRequired(true)
            ),
        action: async (interaction) => {
            if (guardHelloHanniRestriction(interaction)) return;

            const query = interaction.options.getString('query');
            await interaction.reply({ content: `Finding **${query}** from Spotify.`, ephemeral: false });
            const response = await handleSongPlayerCommand(`play ${query}`, interaction);
            await interaction.editReply({ content: response, ephemeral: false });
        }
    },
    {
        command: new SlashCommandBuilder()
            .setName('queue')
            .setDescription('Queue something for you in a voice channel.')
            .setDMPermission(false)
            .setDefaultMemberPermissions(PermissionFlagsBits.DeafenMembers | PermissionFlagsBits.Administrator)
            .addStringOption(option => 
                option
                    .setName('query')
                    .setDescription('You can add song title or links. (Only supports Spotify and Youtube)')
                    .setRequired(true)
            ),
        action: async (interaction) => {
            if (guardHelloHanniRestriction(interaction)) return;

            const query = interaction.options.getString('query');
            await interaction.reply({ content: `Finding **${query}** from Spotify.`, ephemeral: false });
            const response = await handleSongPlayerCommand(`queue ${query}`, interaction);
            await interaction.editReply({ content: response, ephemeral: false });
        }
    },
    {
        command: new SlashCommandBuilder()
            .setName('stop')
            .setDescription('Stop playing current song.')
            .setDMPermission(false)
            .setDefaultMemberPermissions(PermissionFlagsBits.DeafenMembers | PermissionFlagsBits.Administrator),
        action: async (interaction) => {
            await interaction.reply({ content: "**Stopping song player...**", ephemeral: false });
            const response = await handleSongPlayerCommand("stop", interaction);
            await interaction.editReply({ content: response, ephemeral: false });
        }
    },
    {
        command: new SlashCommandBuilder()
            .setName('skip')
            .setDescription('Skip playing current song.')
            .setDMPermission(false)
            .setDefaultMemberPermissions(PermissionFlagsBits.DeafenMembers | PermissionFlagsBits.Administrator),
        action: async (interaction) => {
            if (guardHelloHanniRestriction(interaction)) return;

            await interaction.reply({ content: "**Skipping current song...**", ephemeral: false });
            const response = await handleSongPlayerCommand("skip", interaction);
            await interaction.editReply({ content: response, ephemeral: false });
        }
    },
    {
        command: new SlashCommandBuilder()
            .setName('lyrics')
            .setDescription('Get lyrics for current playing song.')
            .setDMPermission(false)
            .setDefaultMemberPermissions(PermissionFlagsBits.DeafenMembers | PermissionFlagsBits.Administrator),
        action: async (interaction) => {
            if (guardHelloHanniRestriction(interaction)) return;

            await interaction.reply({ content: `Finding lyrics...`, ephemeral: false });
            const response = await handleSongPlayerCommand("lyrics", interaction);
            await interaction.editReply({ content: response, ephemeral: false });
        }
    },
]

function guardHelloHanniRestriction(interaction) {
    if (Community.getChannelHandleTypeByChannelId(interaction.channel.id) === "hello-hanni") {
        return false;
    } else {
        interaction.reply({ content: "Command restricted in this channel.", ephemeral: true });
        return true;
    }
}