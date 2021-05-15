const {MessageType} = require('@adiwajshing/baileys')
var conn = null;

const sendTextMessage = async (phone, message) => {
    const jid = phone + "@s.whatsapp.net";
    return await conn.sendMessage (jid, message, MessageType.text)
}

const isConnected = () => {
    return conn.phoneConnected;
}

module.exports = {
    get: () => {
        return {
            sendTextMessage,
            isConnected
        }
    },
    set: (wp) => {conn = wp}
}