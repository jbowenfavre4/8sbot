const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player')
		.setDescription('Name of player')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of player')
                .setRequired(true)),
	async execute(interaction) {
        const fileService = this.fileService
        const statsService = this.statsService

        let player = interaction.options.getString('name')

        let playerMatches = fileService.getPlayerMatches(player)

        await interaction.reply({ embeds: [statsService.playerStatsService.getPlayerStats(player, playerMatches)] })
        
		
	},
};