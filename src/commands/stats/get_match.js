const { SlashCommandBuilder } = require('discord.js');
const EmbedService = require('../../services/EmbedService')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewmatch')
		.setDescription('View the details of a recorded match')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID of the match')
                .setRequired(true)),
	async execute(interaction) {
        const matchService = this.matchService

        let match = matchService.getMatch(interaction.options.getString('id'))

        if (match != null) {
            if (match.winners.some(player => player.id === interaction.user.id) || match.losers.some(player => player.id === interaction.user.id)) {
                await interaction.reply({ embeds: [EmbedService.getPastMatchEmbed(match)] })
            } else {
                interaction.reply('You do not have permission to view that match since you did not participate.')
            }
            
        } else {
            interaction.reply('Match not found.')
        }
	},
};