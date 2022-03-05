const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Allows the admin or owner to ban the member.")
    .addUserOption((option) => option.setName('user').setDescription('The person who you want to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason to ban member').setRequired(false)),
    async execute (interaction) {

       if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.followUp({ content: "You do not have permission to use this command.", ephemeral: true })

       if (!interaction.client.permissions.has("BAN_MEMBERS")) return interaction.followUp({ content: "Please give me the \"Ban Members\" permission."})

        const user = interaction.options.getUser('user')
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {
          return interaction.followUp({ content: "I couldn't find that member?", ephemeral: true})
        })

        if(!member) return interaction.followUp({content: "Unable to get details related to given member.", ephemeral:true});
        var reason = interaction.options.getString('reason')
        if (!reason) reason = "No reason given."

        if(interaction.client.roles.highest.position <= member.roles.highest.position) 
        return interaction.followUp({content:'I cannot ban that user because they are above me.', ephemeral:true})

        if(!member.bannable || member.user.id === interaction.client.user.id) 
        return interaction.followUp("I am unable to ban this member");
        
        if(interaction.member.roles.highest.position <= member.roles.highest.position) 
        return interaction.followUp('Given member have higher or equal rank as you so i can not ban them.')
        
        const embed = new MessageEmbed()
        .setDescription(`**${member.user.tag}** is banned from the server for \`${reason}\``)
        .setColor("GREEN")
        .setFooter("Ban Member")
        .setTimestamp()

        await member.user.send(`You are banned from **\`${interaction.guild.name}\`** for \`${reason}\``).catch(err => {})
        member.ban({ reason })

        return interaction.followUp({ embeds: [ embed ]})

    },
    
};