const fs = require('fs');
const ENV_FILE_PATH = "./.env";
fs.existsSync(ENV_FILE_PATH) ? require('dotenv').config({ path: ENV_FILE_PATH }) : null;
const {stringify} = require('envfile');

var vars = {
    SECRET_KEY: (process.env.SECRET_KEY !== undefined) ? process.env.SECRET_KEY : "",
    SECRET_AUTH: (process.env.SECRET_AUTH !== undefined) ? process.env.SECRET_AUTH : "",
    DEBUG: (process.env.DEBUG !== undefined) ? (process.env.DEBUG === "true" ? true : false) : false,
    HOST: (process.env.HOST !== undefined) ? process.env.HOST : '127.0.0.1',
    PORT: (process.env.PORT !== undefined) ? (parseInt(process.env.PORT) > 0 ? parseInt(process.env.PORT) : 0) : 80,
    RECONNECT: (process.env.RECONNECT !== undefined) ? (process.env.RECONNECT == "false" ? false : process.env.RECONNECT) : 5
}

var config = {
    get,
    set
}

function prefix() {
    return "# WhatsAppRest Config\r\n\r\n";
}

function get(key)
{
    if(key === undefined) return false;
    if(vars[key] === undefined) return false;
    return vars[key];
}

function set(key, value, save)
{
    if(key === undefined || value === undefined) return;
    if(vars[key] === undefined) return;
    const _save = (save === undefined) ? true : ((save) ? true : false);
    vars[key] = value;
    if(_save) saveEnv();
}

function saveEnv()
{
    fs.writeFileSync(ENV_FILE_PATH, prefix() + stringify(vars));
}

saveEnv();
module.exports = config