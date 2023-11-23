const { SlashCommandBuilder } = require('discord.js');
const { gamemodes } = require('../../data/gamemodes')
const { maps } = require('../../data/maps');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('match')
		.setDescription('Enters a match')
        .addStringOption(option =>
            option.setName('gamemode')
                .setDescription('The gamemode that was played')
                .setRequired(true)
                .addChoices(...gamemodes))
        .addStringOption(option => 
            option.setName('map')
                .setDescription('The map on which the map was played')
                .setRequired(true)
                .addChoices(...maps))
        .addStringOption(option =>
            option.setName('winners')
                .setDescription('The winners and their KDs, formatted like this: \"Player1:K:D,Player2:K:D\"')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('losers')
                .setDescription('The losers and their KDs, formatted like this: \"Player1:K:D,Player2:K:D\"')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('winner-score')
                .setDescription('Score of the winning team')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('loser-score')
                .setDescription('Score of the losing team')
                .setRequired(true))
        ,
	async execute(interaction) {
        const fileService = this.fileService

        logAttempt = fileService.logMatch(interaction)
        if (logAttempt != undefined) {
            let validation = ""
            for (let s of logAttempt) {
                validation = validation + `${s}\n`
            }
            await interaction.reply("Failed to record match:\n" + validation)
        } else {
            await interaction.reply(getInteractReply(interaction))
        }
        
		
	},
};

function getInteractReply(interaction) {
    return `Match logged successfully.
    
    Map: ${interaction.options.getString('map')} ${interaction.options.getString('gamemode')}
    Winners: ${interaction.options.getString('winners')}
    Losers: ${interaction.options.getString('losers')}
    Score: ${interaction.options.getInteger('winner-score')}-${interaction.options.getInteger('loser-score')}`
}

