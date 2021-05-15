const {WAConnection,MessageType} = require('@adiwajshing/baileys');
const config = require('../utils/config');
const encrypt = require('../utils/encrypt');
const wpfuncs = require('./wpfuncs');
var conn = null;

async function start()
{
    var err = false;
    var KEY, AUTH;
    try {
        KEY = encrypt.decrypt(config.get('SECRET_KEY')) || "";
        AUTH = JSON.parse(encrypt.decrypt(config.get('SECRET_AUTH'), KEY)) || false;
        if(KEY.length == 0 || !AUTH) err = true;
    }
    catch(erro) { err = true; }
    if(err) {
        console.log("Invalid KEY or AUTH variable. Run login.js and set auth variables.")
        process.exit(0);
        return;
    }
    conn = new WAConnection();
    wpfuncs.set(conn)
    conn.loadAuthInfo(AUTH); 
    conn.logger.level = config.get('DEBUG') ? 'debug' : 'warn';
    conn.on ('credentials-updated', async () => {
        console.log('Credentials updated!');
        const authInfo = conn.base64EncodedAuthInfo();
        config.set('SECRET_AUTH', encrypt.encrypt(JSON.stringify(authInfo), KEY))
    })    

    conn.on('connecting', async () => {
        console.log(`Connecting to WhatsApp...`);
    });

    conn.on('open', async () => {
        console.log('Connected!')
    });

    conn.on('close', async (err) => {
        if(err.reason == "replaced" && !err.isReconnecting && config.get('RECONNECT') != false) {
            const minutes = (config.get('RECONNECT') > 0) ? config.get('RECONNECT') : 5;
            console.log(`A new device is connected to Whatsapp Web. WhatsAppRest will try to reconnect after ${minutes} minutes.`)
            await new Promise(r => setTimeout(r, 60000 * minutes))
            await start();
        }
        else if(!err.isReconnecting) {
            console.log(`Connection closed! (${err.reason})`)
            process.exit(0);
        }
    })

    try {
        await conn.connect();
    } catch(err) {
        console.log("Error", err)
        process.exit(0);
    }
}
start();
var fnc = wpfuncs.get()
module.exports = fnc