const { SlashCommandBuilder } = require('discord.js');
const { gamemodes } = require('../../data/gamemodes');
const PlayerStatsService = require('../../services/PlayerStatsService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mystats')
		.setDescription('Get your personal stats.')
        .addStringOption(option =>
            option.setName('filter')
                .setDescription('Use this is you would like to only see stats from a specific gamemode.')
                .setRequired(false)
                .addChoices(...gamemodes)),
	async execute(interaction) {
        const playerStatsService = PlayerStatsService

        let embed = ''
        let filter = interaction.options.getString('filter')
        switch (filter) {
            case "snd":
                embed = playerStatsService.getPlayerStats(interaction.user.id, "snd")
                break;
            case "hardpoint":
                embed = playerStatsService.getPlayerStats(interaction.user.id, "hardpoint")
                break
            case "control":
                embed = playerStatsService.getPlayerStats(interaction.user.id, "control")
                break;
            default:
                embed = playerStatsService.getPlayerStats(interaction.user.id, null)
        }

        await interaction.reply({ embeds: [embed] })
        
		
	},
};