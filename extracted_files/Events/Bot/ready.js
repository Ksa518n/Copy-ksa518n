const ClientReady = async(Client) => {
    Client.user.setStatus('idle')
}

module.exports = ClientReady;