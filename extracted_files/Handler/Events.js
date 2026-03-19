const fs = require('fs')

/**
 * @param { import('discord.js').Client } Client
 */

module.exports = async Client => {
    fs.readdirSync(`${process.cwd()}/Events/`).forEach(async Dir => {
        const Events = fs.readdirSync(`${process.cwd()}/Events/${Dir}`).filter((Event) => Event.endsWith('.js'))
        for (const Event of Events) {
            const Ēvent = require(`${process.cwd()}/Events/${Dir}/${Event}`)
            Client.on(Event.split('.')[0], Ēvent.bind(null, Client))
        }
    })
}