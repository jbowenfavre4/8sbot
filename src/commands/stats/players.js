const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('players')
		.setDescription('List players on record')
        .addStringOption(option =>
            option.setName('filter')
                .setDescription('Filter player names')
                .setRequired(false)),
	async execute(interaction) {
        const fileService = this.fileService
        const statsService = this.statsService

		let players = fileService.getPlayerFileData()

        let playersToPrint = []
        let filter = interaction.options.getString('filter')
        
        if (filter != null) {
            players.forEach(player => {
                if (player.name.startsWith(filter)) {
                    playersToPrint.push(player.name)
                }
            })
        } else {
            players.forEach(player => {
                playersToPrint.push(player.name)
            })
        }

        let printMsg = ''
        playersToPrint.forEach(player => {
            printMsg += `${player}\n`
        })

        await interaction.reply(`Players:\n\n${printMsg}`)
        
		
	},
};