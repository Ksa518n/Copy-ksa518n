"use strict";
const { glob } = require('glob')
const { promisify } = require('util')
const Glob = promisify(glob)

module.exports = async Client => {
    const Çʍɗ = Glob(`${process.cwd()}/SlashCommand/*.js`)
    const Çʍɗś = []

    ;(await Çʍɗ).map((Command) => {
        const Cmd = require(Command)
        if(!Cmd.name) return;
        Client.Çʍɗ.set(Cmd.name, Cmd)
        Çʍɗś.push(Cmd)
        console.log(Cmd.name, 'SlashCommand : ✅')
        
    })

    Client.on('ready', async() => Client.application.commands.set(Çʍɗś))
}