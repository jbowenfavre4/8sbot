const { SlashCommandBuilder } = require('discord.js');
const GroupService = require('../../services/GroupService')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('creategroup')
		.setDescription('Create a group with a unique name')
        .addStringOption(option =>
            option.setName('groupname')
                .setDescription('Must be a unique name.')
                .setRequired(true)),
	async execute(interaction) {

        const group_name = interaction.options.getString('groupname')

        if (!GroupService.checkGroupNameExists(group_name)) {
            try {
                GroupService.addGroup(group_name, interaction.user.id)
                interaction.reply(`Successfully created group '${group_name}'. You will need to use the /addtogroup command to add more players.`)
            } catch(e) {
                interaction.reply('There was a problem creating your group. Please try again.')
            }
        } else {
            interaction.reply('Sorry, that group name already exists.')
        }

	},
};