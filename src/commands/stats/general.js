const { SlashCommandBuilder } = require('discord.js');
const { gamemodes } = require('../../data/gamemodes')
const { maps } = require('../../data/maps');
const StatsService = require('../../services/StatsService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('general')
		.setDescription('General stats'),
	async execute(interaction) {
        const fileService = this.fileService
        const statsService = this.statsService

        let data = fileService.getMatchFileData()
		let players = fileService.getPlayerFileData()

        await interaction.reply({ embeds: [statsService.generalStats(data, players)] })
        
		
	},
};