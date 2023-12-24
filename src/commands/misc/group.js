const { SlashCommandBuilder, Embed } = require('discord.js');
const fs = require('fs');
const EmbedService = require('../../services/EmbedService.js');
const GroupService = require('../../services/GroupService.js');

const help_file = "src/data/help.txt"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('group')
		.setDescription('View a group')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the group')
                .setRequired(true)
        ),
	async execute(interaction) {
        let group = GroupService.getGroup(interaction.options.getString('name'))
        if (group != null) {
            interaction.reply({embeds: [EmbedService.getGroupInfoEmbed(group)]})
        } else {
            interaction.reply('That group does not exist.')
        }
    }

}

