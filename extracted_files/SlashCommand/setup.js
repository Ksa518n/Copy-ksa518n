const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { Database } = require('st.db')
const db = new Database('DataBots/Tickets')
module.exports = {
    name: 'setup-ticket',
    description: 'تثبيت التذكره',
    options: [
        {
            name: 'ticket_name',
            description: 'The name of the ticket',
            type: 3,
            required: true
        },
        {
            name: 'message_content',
            description: 'Content inside the ticket',
            type: 3,
            required: true
        },
        {
            name: 'ticket_color',
            description: 'Color of the ticket',
            type: 3,
            required: true
        },
        {
            name: 'button_name',
            description: 'Button name',
            type: 3,
            required: true,
        },
        {
            name: 'button_color',
            description: 'Button color',
            type: 3,
            choices: [
                { name: 'Red', value: 'red' },
                { name: 'Green', value: 'green' },
                { name: 'Blue', value: 'blue' },
                { name: 'Secondary', value: 'Secondary' },
            ],
            required: true,
        },
        {
            name: 'support_role',
            description: 'Role for support staff or those who can view the ticket',
            type: 8,
            required: true,
        },
        {
            name: 'category',
            description: 'Category for opening the ticket',
            type: 7,
            required: true,
        },
        {
            name: 'internal_ticket',
            description: 'Internal ticket appearance',
            type: 3,
            required: true,
        },

        {
            name: 'ticket_image',
            description: 'Ticket image',
            type: 3,
            required: false,
        },
    ],
    
    run: async( Client, Interaction, Args ) => {
    if (!Interaction.member.permissions.has('Administrator')) return;
    const name = Interaction.options.getString('ticket_name')
    const description = Interaction.options.getString('message_content')
    const color = Interaction.options.getString('ticket_color')
    const owner = Interaction.options.getString('button_name')
    const support = Interaction.options.getRole('support_role')
    const category = Interaction.options.getChannel('category')
    const images = Interaction.options.getString('ticket_image')
    const internal = Interaction.options.getString('internal_ticket')
    const color_button = Interaction.options.getString('button_color')

    const Embed = new EmbedBuilder()
    .setColor(`${color || 'Black'}`)
    .setThumbnail(Interaction.guild.iconURL())
    if (images) {
        Embed.setImage(images)
    }
    Embed.setTitle(name)
    Embed.setDescription(description)
    Embed.setFooter({ text: Interaction.guild.name, iconURL: Interaction.guild.iconURL() })
    Embed.setTimestamp()
    const Button = new ButtonBuilder().setCustomId('ticket').setLabel(owner)
    if (color_button === 'red') {
        Button.setStyle(ButtonStyle.Danger)
    }
    if (color_button === 'green') {
        Button.setStyle(ButtonStyle.Success)
    }
    if (color_button === 'blue') {
        Button.setStyle(ButtonStyle.Primary)
    } else if (color_button === 'Secondary') {
        Button.setStyle(ButtonStyle.Secondary)
    }
    const Row = new ActionRowBuilder().addComponents(Button)
    Interaction.channel.send({ embeds: [Embed], components: [Row], }).then(async (msg) => {
        await db.set(`Ticket_${Interaction.channel.id}_${msg.id}`, { Support: support.id, category: category.id, internal: internal})
    })
    Interaction.reply({ content: `تم تسطيب التذكره بنجاح`,  ephemeral: true})
    }
}