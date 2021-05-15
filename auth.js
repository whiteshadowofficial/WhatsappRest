const {WAConnection} = require('@adiwajshing/baileys');
const { Command } = require('commander');
const encrypt = require('./utils/encrypt');
const config = require('./utils/config');

const program = new Command();
program
  .option('-c, --custom [key]', 'custom key variable for remote server auth from local')
  .option('-g, --get', 'show secret auth key of current machine')
  .option('-r, --run', 'run qr code generator')

program.parse(process.argv);

function getKey(decrypt) {
    if(config.get('SECRET_KEY').length != 193) {
        config.set('SECRET_KEY', encrypt.encrypt(encrypt.generate()));
    }
    if(decrypt !== undefined || decrypt == false) return config.get('SECRET_KEY')
    return encrypt.decrypt(config.get('SECRET_KEY'));
}

async function start(key, local) {
    const conn = new WAConnection();
    conn.logger.level = 'warn';
    conn.regenerateQRIntervalMs = 30000;
    conn.on('connecting', async () => {
        console.log(`Waiting connection...`);
    })

    conn.on('open', () => {
        var st = conn.base64EncodedAuthInfo()
        var encrypted = encrypt.encrypt(JSON.stringify(st), key);
        if(local) {
            config.set('SECRET_AUTH', encrypted);
            console.log("\r\nSECRET AUTH STRING SAVED!\r\nYou can see from .env file.")
        }
        else {
            console.log(`\r\nSECRET AUTH STRING GENERATED\r\n\r\n${encrypted}\r\n\r\nSet the environment variable: SECRET_AUTH (via '.env' file)`)
        }
        process.exit(0);
    });

    await conn.connect();
}

const options = program.opts();
if(options.get) {
    console.log(getKey(false)+"#"+encrypt.machineId())
}
else if(options.run) {
    let local = true;
    let SECRET_KEY = getKey();
    if(options.custom && options.custom.length == 258) {
        try {
            const split = options.custom.split("#")
            SECRET_KEY = encrypt.decrypt(split[0], split[1]);
            local = false;
        }
        catch(err) {
            console.log("Invalid encrypted key!")
            return
        }
    }
    start(SECRET_KEY, local);
}
else {
    program.help();
}