const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add a player to the data')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the player')
                .setRequired(true)),
	async execute(interaction) {
        const fileService = this.fileService

        let addAttempt = fileService.addPlayer(interaction.options.getString('name'))
        if (addAttempt != undefined) {
            let validation = ""
            for (let s of addAttempt) {
                validation = validation + `${s}\n`
            }
            await interaction.reply("Failed to add player:\n" + validation)
        } else {
            await interaction.reply(getPlayerAddedSuccessReply(interaction))
        }
	},
};

function getPlayerAddedSuccessReply(interaction) {
    return `
    Player ${interaction.options.getString('name')} added successfully.
    `
}