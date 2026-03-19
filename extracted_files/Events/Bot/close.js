const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js")

const { Database } = require('st.db')
const db = new Database('DataBots/Tickets')
module.exports = async ( Client, Interaction ) => {

        if (Interaction.isButton()) {

            if (Interaction.customId == 'close') {
        const Embed = new EmbedBuilder()
        .setAuthor({ name: Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL()})
        .setDescription(`**هل انت بالفعل تريد اغلاق التذكره ؟**`)
        .setTitle(`Close Ticket 🔒`)
        .setFooter({ text: Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL()})
        
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('Yes11').setLabel('نعم').setEmoji('🔒').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('No11').setLabel('لا').setEmoji('🔓').setStyle(ButtonStyle.Secondary),
        )
        Interaction.reply({ embeds: [Embed], components: [Row]})
    } else if (Interaction.customId === 'Yes11') {
        db.add(`closed`, 1)
        const id = db.get('closed')
        const Ticket = db.get(`TICKET-PANEL_${Interaction.channel.id}`)
        Interaction.channel.permissionOverwrites.edit( Ticket.author, { ViewChannel: false })
        const Embed = new EmbedBuilder()
        .setDescription(`**تم اغلاق التذكره**`)
        const Roww = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('delete').setLabel('حذف').setEmoji('🎯').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('Open').setLabel('فتح').setEmoji('🔓').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('Tran').setLabel('حفظ التذكره').setEmoji('📃').setStyle(ButtonStyle.Secondary),
        )
        await Interaction.deferUpdate()
        await Interaction.editReply({ embeds: [Embed], components: [Roww]}).then(() => {
        Interaction.channel.setName(`🔓 closed-${id}`)
        const Logs = db.get(`LogsRoom_${Interaction.guild.id}`)
        const Log = Interaction.guild.channels.cache.get(Logs)
        const Ticket = db.get(`TICKET-PANEL_${Interaction.channel.id}`)
        const Embedd = new EmbedBuilder()
        .setAuthor({ name: Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL()})
        .setTitle('Close Ticket')
        .setFields(
            { name: `Name Ticket`, value: `${Interaction.channel.name}`},
            { name: `Owner Ticket`, value: `${Ticket.author}`},
            { name: `Close BY Ticket`, value: `${Interaction.user}`},

        )
        .setFooter({ text: Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL()})
        Log?.send({ embeds: [Embedd]})

        })
    } else if (Interaction.customId === 'No11') {
        await Interaction.deferUpdate()
        await Interaction.deleteReply()
    }  else if (Interaction.customId === 'delete') {
        await Interaction.reply({ content: `#${Interaction.channel} has been successfully deleted :unlock:`, ephemeral: true})
        setTimeout( async () => {
        await Interaction.channel.delete()
        }, 5000)
        const Logs = db.get(`LogsRoom_${Interaction.guild.id}`)
        const Log = Interaction.guild.channels.cache.get(Logs)
        const Ticket = db.get(`TICKET-PANEL_${Interaction.channel.id}`)
        const Embedd = new EmbedBuilder()
        .setAuthor({ name: Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL()})
        .setTitle('Delete Ticket')
        .setFields(
            { name: `Name Ticket`, value: `${Interaction.channel.name}`},
            { name: `Owner Ticket`, value: `${Ticket.author}`},
            { name: `Delete BY Ticket`, value: `${Interaction.user}`},

        )
        .setFooter({ text: Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL()})
        Log?.send({ embeds: [Embedd]})

    }  else if (Interaction.customId === 'Open') {
        db.add(`opened`, 1)
        const id = db.get('opened')
        const Ticket = db.get(`TICKET-PANEL_${Interaction.channel.id}`)
        Interaction.channel.permissionOverwrites.edit( Ticket?.author, { ViewChannel: true })
        Interaction.channel.setName(`🔓 opened-${id}`)
        await Interaction.deferUpdate()
        await Interaction.deleteReply()

    }  else if (Interaction.customId === 'Tran') {
        const discordTranscripts = require('discord-html-transcripts');
        const Channel = Interaction.channel
        const attachment = await discordTranscripts.createTranscript(Channel);
        const Logs = db.get(`LogsRoom_${Interaction.guild.id}`)
        const Log = Interaction.guild.channels.cache.get(Logs)
        const Ticket = db.get(`TICKET-PANEL_${Interaction.channel.id}`)
        const Embed = new EmbedBuilder()
        .setAuthor({ name: Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL()})
        .setTitle('Transcripted Ticket')
        .setFields(
            { name: `Name Ticket`, value: `${Interaction.channel.name}`},
            { name: `Owner Ticket`, value: `${Ticket.author}`},
            { name: `Transcript BY `, value: `${Interaction.user}`},

        )
        .setFooter({ text: Interaction.user.tag, iconURL: Interaction.user.displayAvatarURL()})
        Log?.send({ embeds: [Embed]})
        Channel.send({ files: [attachment] })
        Log?.send({ files: [attachment] })
        Interaction.reply({ content: `#${Interaction.channel.name} has been successfully Transcripted`, ephemeral: true})
    }

}}