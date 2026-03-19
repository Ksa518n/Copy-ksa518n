const { Database } = require("st.db")
const db = new Database('DataBots/Tickets')
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
/**
 * 
 * @param {import ('discord.js').Client } Client 
 * @param { import ('discord.js').Interaction } Interaction 
 * @returns 
 */
module.exports = async( Client, Interaction ) => {
    if (Interaction.isButton()) {
        if (Interaction.customId === 'ticket') {
        const Data = db.get(`Ticket_${Interaction.channel.id}_${Interaction.message.id}`)
        if (!Data) return Interaction.reply({ content: `Please Setup Agin`, ephemeral: true})
        const User = db.get(`Ticket_${Interaction.user.id}_${Interaction.guild.id}_${Interaction.message.id}`)
        if (Interaction.guild.channels.cache.get(User)) return Interaction.reply({ content: `Your have ticket <#${User}>`, ephemeral: true}) 
        Interaction.guild.channels.create({
            name: `ticket-${Interaction.user.username}`,
            type: 0,
            parent: Data.category,
            permissionOverwrites: [
                {
                    id: Interaction.guild.roles.everyone.id,
                    deny: ['ViewChannel'],
                },
                {
                    id: Data.Support,
                    allow: ['ViewChannel', 'SendMessages'],
                },
                {
                    id: Interaction.user.id,
                    allow: ['ViewChannel', 'SendMessages'],
                },
            ],
        }).then( async (Channel) => {
        db.set(`TICKET-PANEL_${Channel.id}`, { author: Interaction.user.id, Support: Data.Support })
        Interaction.reply({ content: `${Channel} has been created :white_check_mark:`, ephemeral: true})
        const Embed = new EmbedBuilder()
        Embed.setColor('Random')
        Embed.setDescription(`${Data.internal}`)
        Embed.setFooter({ text: Interaction.guild.name, iconURL: Interaction.guild.iconURL() })
        Embed.setTimestamp()
        
        
            })
        }
       }
    }
