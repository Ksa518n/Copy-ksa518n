







const http = require('http')
const PORT = process.env.PORT || 3000
http.createServer((req, res) => {
    res.writeHead(200)
    res.end('Bot is running!')
}).listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`)
})

const { Client, GatewayIntentBits, Collection } = require('discord.js')
// Client Intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ]
})
// Client Ready
client.on('ready', () => {
    client.user.setStatus('idle')
    client.user.setActivity('Harly Host')
    console.log('Client Is Ready', client.user.username)
})

// Handler
const fs = require('fs')
client.slashCommands = new Collection()
client.Çʍɗ = new Collection()
fs.readdirSync('./Handler/').forEach((Handler) => require(`./Handler/${Handler}`)(client))
module.exports = client;
client.config = require('./config.json')


// cloner

const SelfBot = require('discord.js-selfbot-v13');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { parentId, probot_ids, recipientId, price, log } = require('./config.js');
const cooldowns1 = new Map();
const cooldowns2 = new Map();
const cooldowns = new Map();

const owners = ["1187328181737365537"];

const { JsonDatabase } = require("wio.db");
const Database = new JsonDatabase({ databasePath: "DataBase.json" });


const client2 = new SelfBot.Client({ checkUpdate: false, captchaKey: "98b4b79407babcf588342ade2258268e", captchaService: "2captcha" });
process.on('unhandledRejection', (err) => console.error(err));
client.on('ready', () => {
    console.log(`${client.user.username} Is Online !`);
});
client2.on('ready', async () => {
    console.log(`${client2.user.username} Is Online !`);
});
client.login(process.env.BOT_TOKEN) // Bot Token
client2.login(process.env.ACCOUNT_TOKEN) // Account Token

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {

        if (interaction.customId === 'confirm-' && cooldowns.get(interaction.message.id) && !cooldowns2.has(interaction.user.id)) {
            const { user, id, url } = cooldowns.get(interaction.message.id);
            if (user !== interaction.user.id) return;
            const Guild = Database.get(`Guild`)
            await interaction.deferReply({ ephemeral: true });
            const guild2 = client2.guilds.cache.get(Guild[0]);
            if (!guild2) return interaction.editReply('انت لست موجود في الخادم التاني');
            await cooldowns2.set(interaction.user.id);
            await interaction.editReply(`\`\`\`#credit ${recipientId} ${price}\`\`\``);
            let done = false;
            await client2.fetchInvite(url).then(async invite => {
                await invite.acceptInvite().then(async () => {
                    console.log(`**Done Join Server : ${invite.guild.name} \nBy : ${invite.inviter}**`);
                });
            });
            const guild = await client2.guilds.fetch(id);
            const price1 = price === 1 ? 1 : Math.floor(price * 0.95);
            const filter = message => probot_ids.includes(message.author.id) && message.content.includes(`${price1}`) & message.content.includes(`${recipientId}`) && message.content.includes(`${interaction.user.username}`);
            const pay = await interaction.channel.createMessageCollector({ filter, max: 1, time: 3e5 });
            const Channel = client.channels.cache.get(log);

            const Embed = new EmbedBuilder()
                .setColor('#8000F2')
                .addFields([
                    { name: `تم شراء نسخ سيرفر بواسطه`, value: `${interaction.user}` },
                ]);

            Channel.send({ embeds: [Embed] });
            ;
            pay.once('collect', async () => {
                done = true;
                interaction.editReply('<:discotoolsxyzicon_221:1198262160309108786>');
                for (const [, channel] of guild2.channels.cache) {
                    await channel.delete().catch(() => { });
                }
                for (const [, role] of guild2.roles.cache) {
                    await role.delete().catch(() => { });
                }
                for (const [, emoji] of guild2.emojis.cache) {
                    await emoji.delete().catch(() => { });
                }
                const roles = new Map();
                const categories = new Map();
                const guildRoles = [...guild.roles.cache.values()].sort((a, b) => a.rawPosition - b.rawPosition);
                const guildCategories = [...guild.channels.cache.filter((channel) => channel.type === 'GUILD_CATEGORY').values()].sort((a, b) => a.rawPosition - b.rawPosition);
                const guildChannels = [...guild.channels.cache.filter((channel) => channel.type !== 'GUILD_CATEGORY').values()].sort((a, b) => a.rawPosition - b.rawPosition);
                const sentMessage = await interaction.channel.send('بدا النسخ');
                for (const role of guildRoles) {
                    try {
                        if (role.id === guild.roles.everyone.id) {
                            await guild2.roles.everyone.setPermissions(role.permissions.toArray());
                            sentMessage.edit('```جاري نسخ الرتب الان <:discotoolsxyzicon_341:1198261759417520218> .```');
                            roles.set(role.id, guild2.roles.everyone);
                            continue;
                        }
                        const createdRole = await guild2.roles.create({
                            name: role.name,
                            position: role.rawPosition,
                            color: role.color,
                            hoist: role.hoist,
                            mentionable: role.mentionable,
                            permissions: role.permissions.toArray(),
                        });
                        console.log(`Created Role: ${createdRole.name}`);
                        roles.set(role.id, createdRole);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch {
                        console.error(`Failed to create role: ${role.name}`);
                    }
                }
                sentMessage.edit('``` <:discotoolsxyzicon_341:1198261759417520218> تم الانتهاء من عمل الرولات```');
                for (const category of guildCategories) {
                    try {
                        const permissionOverwrites = [];
                        for (const [, overwrite] of category.permissionOverwrites.cache) {
                            const role = roles.get(overwrite.id);
                            if (role) {
                                permissionOverwrites.push({
                                    id: role.id,
                                    allow: overwrite.allow.toArray(),
                                    deny: overwrite.deny.toArray()
                                });
                            }
                        }
                        const createdCategory = await guild2.channels.create(category.name, {
                            type: 'GUILD_CATEGORY',
                            permissionOverwrites
                        });
                        console.log(`Created Category: ${createdCategory.name}`);
                        categories.set(category.id, createdCategory);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch {
                        console.error(`Failed to create category: ${category.name}`);
                    }
                }
                sentMessage.edit('جاري النسخ <:discotoolsxyzicon_341:1198261759417520218>\n```1 - تم تحديث رتبة Everyone\n2 - تم الإنتهاء من الرولات\n3 - تم الإنتهاء من الكاتجوري```');
                for (const channel of guildChannels) {
                    try {
                        const permissionOverwrites = [];
                        const type = channel.type === 'GUILD_TEXT' ? 'GUILD_TEXT' : channel.type === 'GUILD_VOICE' ? 'GUILD_VOICE' : 'GUILD_TEXT';
                        const parent = channel.parentId ? categories.get(channel.parentId) : null;
                        for (const [, overwrite] of channel.permissionOverwrites.cache) {
                            const role = roles.get(overwrite.id);
                            if (role) {
                                permissionOverwrites.push({
                                    id: role.id,
                                    allow: overwrite.allow.toArray(),
                                    deny: overwrite.deny.toArray()
                                });
                            }
                        }
                        const createdChannel = await guild2.channels.create(channel.name, {
                            type,
                            permissionOverwrites,
                            parent
                        });
                        console.log(`Created Channel: ${createdChannel.name}`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch {
                        console.error(`Failed to create channel: ${channel.name}`);
                    }
                }
                sentMessage.edit('جاري النسخ <:discotoolsxyzicon_341:1198261759417520218>\n```1 - تم تحديث رتبة Everyone\n2 - تم الإنتهاء من الرولات\n3 - تم الإنتهاء من الكاتجوري\n4 - تم الإنتهاء من القنوات```');
                let emojiCount = 0;
                for (const [, emoji] of guild.emojis.cache) {
                    try {
                        if (emojiCount >= 10) break; // Exit loop if 50 emojis have been cloned
                        const createdEmoji = await guild2.emojis.create(emoji.url, emoji.name);
                        console.log(`Created emoji: ${createdEmoji.name}`);
                        emojiCount++;
                    } catch (error) {
                        console.error(`Failed to create emoji: ${emoji.name}`, error); // Log the error
                    }
                }
                interaction.deleteReply();

                cooldowns1.delete(interaction.user.id);
                cooldowns2.delete(interaction.user.id);

                sentMessage.edit('تم النسخ بنجاح <:discotoolsxyzicon_421:1198261471176573098>\n```1 - تم تحديث رتبة Everyone\n2 - تم الإنتهاء من الرولات\n3 - تم الإنتهاء من الكاتجوري\n4 - تم الإنتهاء من القنوات\n5 - تم الإنتهاء من الايموجي ```');
                interaction.channel.send('لقد تم إرسال السيرفر الذي تم نسخه في الخاص <:discotoolsxyzicon_421:1198261471176573098>')
                
                const guildArray = Database.get(`Guild`) || [];
                const deletedGuildId = guildArray.shift(); // Remove the first element (the cloned server ID)
                const deleteBaseData = require('./DeleteBase.json');
                deleteBaseData.deleted.push(deletedGuildId);
                fs.writeFileSync('DeleteBase.json', JSON.stringify(deleteBaseData, null, 2));
                await guild.leave();
                
// Save the modified database back to the file
Database.set(`Guild`, guildArray);
                const invite = await guild2.channels.cache
                    .filter(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(client2.user).has('CREATE_INSTANT_INVITE'))
                    .first()
                    .createInvite({ maxUses: 7, unique: true, reason: 'Copy Server' });
                const template = await guild2.createTemplate('Harly Host ', 'هذا قالب للسيرفر الذي نسخته');
                const channel1205245197576048710 = interaction.guild.channels.cache.get('1207281728159359087');
                await channel1205245197576048710.send(`هذا القالب المنسوخ  https://discord.new/${template.code}`);
                const Embed = new EmbedBuilder()
                Embed.addFields([
                 { name: `تم شراء من قبل : `, value: `${interaction.user}` },
                 { name: `سيرفر تم نسخ في : `, value: `${guild2.id} | ${guild2.name}` },
                 { name: `سيرفر نسخ منو :`, value: `${guild.id} | ${guild.name}` },
                ]);
                channel1205245197576048710.send({ embeds: [Embed] });

                interaction.user.send(`الى العميل العزيز،\nنتقدم بخالص الشكر والتقدير لك على اختيارك لنا لتلبية احتياجاتك الخاصة بالخدمات الرقمية. نحن ممتنون لثقتك الكريمة فينا ونسعد بخدمتك في كل مرة.\nنود أن نعبر لك عن تقديرنا العميق لوقتك وثقتك التي وضعتها في خدماتنا. نحن دائماً ملتزمون بتقديم أعلى مستويات الجودة والمهنية، ونسعى جاهدين لضمان رضاك التام.\nندعوك بصدق لتقديم تقييم عن تجربتك معنا، فإنه يساعدنا على تحسين خدماتنا وتلبية احتياجاتك بشكل أفضل في المستقبل.  https://discord.com/channels/1164915628818313349/1204590890975494174\nعليك أن تستعمل القالب لان صلاحيته ستنفذ بعد 24 ساعة !!!
نتطلع إلى خدمتك مرة أخرى في المستقبل القريب.\nأطيب التحيات،\nفريق هارلي <:discotoolsxyzicon_421:1198261471176573098> \n https://discord.new/${template.code}`)
                    .catch(error => {
                        console.error(`Failed to send message to ${interaction.user.tag}:`, error);
                    });
                await interaction.channel.delete();
                
            });
            pay.once('end', () => {
                if (done) return;
                cooldowns1.delete(interaction.user.id);
                cooldowns2.delete(interaction.user.id);
                interaction.editReply('**انتهى وقت التحويل...**');
            });
        }

        if (interaction.customId === 'confirm' && !cooldowns1.has(interaction.user.id)) {
            const modal = new ModalBuilder()
                .setCustomId('server-modal')
                .setTitle('Copy Server');
            const id = new TextInputBuilder()
                .setCustomId('id')
                .setMinLength(1)
                .setPlaceholder('Ex: https://discord.gg/h-e')
                .setStyle(TextInputStyle.Short)
                .setLabel('رابط الخادم (Server url To Copy)');
            const row1 = new ActionRowBuilder().addComponents(id);
            modal.addComponents(row1);
            interaction.showModal(modal);
        }

        if (interaction.customId === 'cancel') {
            cooldowns1.delete(interaction.user.id);
            cooldowns2.delete(interaction.user.id);
            interaction.channel.delete();
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'server-modal' && !cooldowns1.has(interaction.user.id)) {
            const id = interaction.fields.getTextInputValue('id');
            await interaction.deferReply({ ephemeral: true });
            let GuildId;
            try {
                const Invite = await client.fetchInvite(id);
                GuildId = Invite.guild;
                if (GuildId.id === '1164915628818313349') {
                    await interaction.followUp({ content: 'مسكتك تريد تنسخ سيرفرنا ؟😂' });
                    return;
                }
            } catch {
                return await interaction.followUp({ content: 'x' });
            }
            await cooldowns1.set(interaction.user.id);
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm-')
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Confirm'),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Cancel'));
            const msg = await interaction.editReply({
                content: `هل أنت متأكد ان تريد نسخ ${GuildId.name}؟`,
                components: [row]
            });
            cooldowns.set(msg.id, { user: interaction.user.id, id: GuildId.id, url: id });
        }
    }
});


client.on('channelCreate', (channel) => {
  if (channel.parentId === `${parentId}`) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirm')
        .setStyle(ButtonStyle.Success)
        .setLabel('متابعة'),
      new ButtonBuilder()
        .setCustomId('close')
        .setStyle(ButtonStyle.Secondary)
        .setLabel('قفل التذكره')
    );
      
     
    const embed = new EmbedBuilder()
      .setTitle('## Harly Host Cloner . ')
      .setDescription('أنت على وشك شراء نسخ لسيرفر ، الرجاء الضغط على متابعة لأكمال عملية الشراء')
      .setColor('#06b4d8'); // You can set any color you want
    channel.send({
      embeds: [embed],
      components: [row]
    })
    .then(() => {
      console.log('Message sent successfully in the targeted category.');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
  }
});




//list
client.on('messageCreate', (message) => {
    if (!owners.includes(message.author.id)) return; // Ignore messages from bots
    if (message.content === '!list') {
        // Read the database file
        fs.readFile('DataBase.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading database file:', err);
                return message.reply('An error occurred while reading the database.');
            }

            try {
                // Parse the JSON data
                const database = JSON.parse(data);
                const guildIds = database?.Guild || [];

                // Check if there are any IDs in the database
                if (guildIds.length === 0) {
                    return message.reply('There are no server IDs stored in the database.');
                }

                // Create an embed to display the list of IDs
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('قائمة معرفات السيرفرات المخزنة :')
                    .setDescription(guildIds.join('\n'));

                // Send the embed to the channel
                message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Error parsing database JSON:', error);
                message.reply('An error occurred while parsing the database.');
            }
        });
    }
});




//create
client2.on('messageCreate', async (message) => {
    if (!owners.includes(message.author.id)) return; // Ignore messages from other users
    if (message.content === '!create') {
        try {
            const guild = await client2.guilds.create('Harly Host', {
                channels: [{
                    name: 'general',
                    type: 'GUILD_TEXT'
                }]
            });
            const channelId = guild.channels.cache.find(channel => channel.name === 'general').id;
            message.channel.send(`Server created successfully! Server ID: ${guild.id}`);
            
            // Add the created server's ID to the database
            const guildArray = Database.get(`Guild`) || [];
            guildArray.push(guild.id);
            Database.set(`Guild`, guildArray);
            message.channel.send(`Server ID added to the database.`);
            
            const channelToSendId = client2.channels.cache.get('1243569353488859316'); // Replace 'YOUR_CHANNEL_ID' with the actual ID of the channel you want to send the server ID to
            if (channelToSendId) {
                channelToSendId.send(`Server created successfully! Server ID: ${guild.id}`);
            } else {
                console.error('Channel to send ID not found.');
            }
        } catch (error) {
            console.error('Error creating server:', error);
            message.channel.send('An error occurred while creating the server.');
        }
    }
});




//delete
client2.on('messageCreate', async (message) => {
    if (!owners.includes(message.author.id)) return; // Ignore messages from other users
    if (message.content === '!delete') {
        try {
            const guildArray = Database.get(`Guild`) || [];
            const deleteBaseData = require('./DeleteBase.json');
            const deletionDelay = 2000; // 2 seconds delay between each deletion

            if (deleteBaseData.deleted.length === 0) {
                message.channel.send(`No servers found in the delete base.`);
                return;
            }

            for (const guildId of deleteBaseData.deleted) {
                const guild = client2.guilds.cache.get(guildId);
                if (guild) {
                    await guild.delete();
                    message.channel.send(`Server with ID ${guildId} deleted successfully.`);
                } else {
                    message.channel.send(`Server with ID ${guildId} not found.`);
                }
                await new Promise(resolve => setTimeout(resolve, deletionDelay));

                // Remove the deleted server's ID from the database
                const index = guildArray.indexOf(guildId);
                if (index !== -1) {
                    guildArray.splice(index, 1);
                }
            }

            // Clear the deleted server IDs in the delete base
            deleteBaseData.deleted = [];
            fs.writeFileSync('DeleteBase.json', JSON.stringify(deleteBaseData, null, 2));

            // Update the database with the modified guild array
            Database.set(`Guild`, guildArray);
            message.channel.send(`All servers deleted successfully.`);
        } catch (error) {
            console.error('Error deleting servers:', error);
            message.channel.send('An error occurred while deleting servers.');
        }
    }
});





//dlist
client.on('messageCreate', async (message) => {
    if (!owners.includes(message.author.id)) return; // Ignore messages from other users
    if (message.content === '!dlist') {
        try {
            const deleteBaseData = require('./DeleteBase.json');

            if (deleteBaseData.deleted.length === 0) {
                message.channel.send(`No server IDs found in the delete base.`);
                return;
            }

            // Create an embed to display the list of deleted server IDs
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('List of Deleted Server IDs:')
                .setDescription(deleteBaseData.deleted.join('\n'));

            // Send the embed with the list of deleted server IDs
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error reading DeleteBase.json:', error);
            message.channel.send('An error occurred while reading the delete base.');
        }
    }
});



//help
client.on('messageCreate', async (message) => {
    if (!owners.includes(message.author.id)) return; // Ignore messages from other users
    if (message.content === '!help') {
        try {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('قائمة الأوامر:')
                .setDescription('قائمة بالأوامر المتوفرة مع وصفها:')
                .addFields(
                    { name: '!list', value: 'يظهر قائمة بمعرفات السيرفرات المخزنة.', inline: false },
                    { name: '!create', value: 'ينشئ سيرفر جديد ويضيف معرفه لقاعدة البيانات.', inline: false },
                    { name: '!delete', value: 'يحذف جميع السيرفرات المخزنة في قاعدة البيانات ويحذف القواعد.', inline: false },
                    { name: '!dlist', value: 'يظهر قائمة بمعرفات السيرفرات المحذوفة.', inline: false },
                    { name: '!help', value: 'يظهر قائمة الأوامر المتوفرة.', inline: false }
                );

            // Send the embed with the list of commands and descriptions
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error generating help command:', error);
            message.channel.send('An error occurred while generating the help command.');
        }
    }
});




