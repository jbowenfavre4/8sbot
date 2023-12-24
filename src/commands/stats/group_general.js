const { SlashCommandBuilder } = require('discord.js');
const { gamemodes } = require('../../data/gamemodes');
const GroupService = require('../../services/GroupService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('groupstats')
		.setDescription('Stats for a group')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Name of the group')
				.setRequired(true))
        .addStringOption(option => 
            option.setName('gamemode')
                .setDescription('Gamemode filter')
                .setRequired(false)
                .addChoices(...gamemodes)),
		
	async execute(interaction) {
        const statsService = this.statsService
		let embed = ""
		let gamemode_filter = interaction.options.getString('gamemode')
        let group_name = interaction.options.getString('name')
        if (!GroupService.checkGroupNameExists(group_name)) {
            interaction.reply("That group does not exist.")
        } else if (!GroupService.checkIfPlayerInGroup(group_name, interaction.user)) {
            interaction.reply("You are not in that group.")
        } else if (gamemode_filter != null) {
			embed = statsService.generalStats(gamemode_filter, group_name)
            await interaction.reply({ embeds: [embed] })
		} else {
			embed = statsService.generalStats(null, group_name)
            await interaction.reply({ embeds: [embed] })
		}
	},
};