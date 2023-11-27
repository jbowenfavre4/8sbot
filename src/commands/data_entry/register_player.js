const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Add yourself to the database'),
	async execute(interaction) {
        const registerService = this.registerService

        if (!registerService.checkIfPlayerRegistered(interaction.user)) {
            try {
                registerService.addPlayer(interaction.user)
                interaction.reply(`Successfully registered user ${interaction.user.username}`)
            } catch(e) {
                console.log(e)
                interaction.reply("There was an error registering this user. Please try again.")
            }
            
        } else {
            interaction.reply("You are already registered.")
        }

	},
};