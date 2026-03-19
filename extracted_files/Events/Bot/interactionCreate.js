module.exports = async(Client, Interaction) => {
    if(Interaction.isButton()) {
    Client.emit('claim', (Client, Interaction))
    Client.emit('close', (Client, Interaction))
    Client.emit('open', (Client, Interaction))
    } else if(Interaction.isChatInputCommand()) {
        const Cmd = Client.Çʍɗ.get(Interaction.commandName);
        if(!Cmd) return;
        try {
            Cmd.run(Client, Interaction)
        } catch(Err) {
            console.log(Err)
        }
    } else if (Interaction.isModalSubmit()) {
      
    }
}