const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Add yourself to the database'),
	async execute(interaction) {
        const registerService = this.registerService
        const directMessageService = this.directMessageService

        if (!registerService.checkIfPlayerRegistered(interaction.user)) {
            try {
                registerService.addPlayer(interaction.user)
                interaction.reply(`Successfully registered user ${interaction.user.username}`)
                directMessageService.sendMessage(interaction.user.id, "You have successfully registered with 8sbot. Please use the /help command in the server where you registered for more info.")

            } catch(e) {
                console.log(e)
                interaction.reply("There was an error registering this user. Please try again.")
            }
            
        } else {
            interaction.reply("You are already registered.")
        }

	},
};