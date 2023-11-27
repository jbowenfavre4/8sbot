const { SlashCommandBuilder } = require('discord.js');
const RegisterService = require('../../services/RegisterService')
const { gamemodes } = require('../../data/gamemodes')
const { maps } = require('../../data/maps');
const EmbedService = require('../../services/EmbedService')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('recordmatch')
		.setDescription('Record a match')
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
            option.setName('winner1')
                .setDescription('Name of player on winning team')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('w1-kdo')
                .setDescription('Kills, deaths, and obj for winner 1. Format is K/D/O')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('winner2')
                .setDescription('Name of player on winning team')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('w2-kdo')
                .setDescription('Kills, deaths, and obj for winner 2. Format is K/D/O')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('winner3')
                .setDescription('Name of player on winning team')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('w3-kdo')
                .setDescription('Kills, deaths, and obj for winner 3. Format is K/D/O')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('winner4')
                .setDescription('Name of player on winning team')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('w4-kdo')
                .setDescription('Kills, deaths, and obj for winner 4. Format is K/D/O')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('loser1')
                .setDescription('Name of player on losing team')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('l1-kdo')
                .setDescription('Kills, deaths, and obj for loser 1. Format is K/D/O')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('loser2')
                .setDescription('Name of player on losing team')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('l2-kdo')
                .setDescription('Kills, deaths, and obj for loser 2. Format is K/D/O')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('loser3')
                .setDescription('Name of player on losing team')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('l3-kdo')
                .setDescription('Kills, deaths, and obj for loser 3. Format is K/D/O')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('loser4')
                .setDescription('Name of player on losing team')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('l4-kdo')
                .setDescription('Kills, deaths, and obj for loser 4. Format is K/D/O')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('winner-score')
                .setDescription('Score of the winning team')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('loser-score')
                .setDescription('Score of the losing team')
                .setRequired(true)),
    async autocomplete(interaction) {
        
        const focusedValue = interaction.options.getFocused();
		const choices = RegisterService.getRegistry()
		const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice.name, value: choice.value })),
		)
    },

	async execute(interaction) {
        const names_map = new Map()
        names_map.set("winner1", interaction.options.getString('winner1'))
        names_map.set('winner2', interaction.options.getString('winner2'))
        names_map.set('winner3', interaction.options.getString('winner3'))
        names_map.set('winner4', interaction.options.getString('winner4'))
        names_map.set('loser1', interaction.options.getString('loser1'))
        names_map.set('loser2', interaction.options.getString('loser2'))
        names_map.set('loser3', interaction.options.getString('loser3'))
        names_map.set('loser4', interaction.options.getString('loser4'))
        
        const matchService = this.matchService

        const match_id = generateUniqueId()
        
        logAttempt = matchService.logMatch(interaction, match_id)
        
        if (logAttempt != undefined) {
            let validation = ""
            for (let s of logAttempt) {
                validation = validation + `${s}\n`
            }
            await interaction.reply("Failed to record match:\n" + validation)
        } else {

            const embed = EmbedService.getMatchEmbed(interaction.options, match_id)
            const directMessageService = this.directMessageService
            names_map.forEach(player => {
                try {
                    directMessageService.sendMessage(player, `-----------------------------------------------------------\nA match you participated in was recorded:\n\nMatch id: ${match_id}\nMap: ${interaction.options.getString('map')}\nGamemode: ${interaction.options.getString('gamemode')}\nEntered by: ${interaction.user.username}\n\nGet more info using the /viewmatch command\nIf there is an issue, please open a support ticket.\n-----------------------------------------------------------`)
                } catch(e) {
                    console.log('Failed to send message to ', player)
                }
            })

            await interaction.reply({ embeds: [embed] })
        }

	},
    
};

function generateUniqueId() {
    const timestamp = new Date().getTime();
    const randomValue = Math.floor(Math.random() * 1000000); // Adjust the range as needed
    return `${timestamp}${randomValue}`;
}
