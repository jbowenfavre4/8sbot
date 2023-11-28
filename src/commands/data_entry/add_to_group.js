const { SlashCommandBuilder } = require('discord.js');
const GroupService = require('../../services/GroupService');
const RegisterService = require('../../services/RegisterService');
const DirectMessageService = require('../../services/DirectMessageService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtogroup')
		.setDescription('Add a player to a group.')
        .addStringOption(option =>
            option.setName('groupname')
                .setDescription('You must be the creator of the group to add players.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('player')
                .setDescription('Player to add to the group.')
                .setRequired(true)
                .setAutocomplete(true)
            ),

    async autocomplete(interaction) {

        const focusedValue = interaction.options.getFocused();
        const choices = RegisterService.getRegistry()
        const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value })),
        )
    },

	async execute(interaction) {
        const directMessageService = this.directMessageService

        let playerId = interaction.options.getString('player')
        let group_name = interaction.options.getString('groupname')

        if (!GroupService.isOwner(interaction.user.id, group_name)) {
            interaction.reply('You are not the creator of this group.')
        } else if (GroupService.checkIfPlayerInGroup(group_name, playerId)) {
            interaction.reply('That player is already in the group.')
        } else {
            GroupService.addPlayerToGroup(playerId, group_name)
            interaction.reply(`Successfully added player ${RegisterService.getName(playerId)} to group.`)
            directMessageService.sendMessage(playerId, `You were added to the group '${group_name}' by ${RegisterService.getName(interaction.user.id)}.`)
        }

	},
};