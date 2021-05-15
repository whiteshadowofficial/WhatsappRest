const fs = require('fs');
const WHITELIST_FILE = './ip_whitelist.txt';
if(!fs.existsSync(WHITELIST_FILE)) fs.writeFileSync(WHITELIST_FILE, "");
const {regexIpAddress} = require('../../utils/funcs');
const ipList = fs.readFileSync(WHITELIST_FILE).toString().replace(/\r\n/gm, "\n").split("\n").map(x => regexIpAddress(x)).filter(x => x.length > 0);
var router = require('express').Router();
const RequestIp = require('@supercharge/request-ip');
var wp = null;

router.use(function (req, res, next) {
    try {
        var ip = RequestIp.getClientIp(req);
        if(!check(ip)) {
            res.status(401).send(`401 Unauthorized : ${ip}`);
            return;
        }
    }
    catch(err) {
        res.status(401).send("401 Unauthorized");
        return;
    }
    next()
})

router.use(function (req, res, next) {
    if(!wp.isConnected()) {
        res.status(405).send({error: true, code: 'WP_NOT_ALIVE'});
        return;
    }
    next()
})

function check(ip)
{
    if(ip.length < 1) return false;
    return ipList.includes(ip);
}

module.exports = (_wp) => {
    wp = _wp;
    return router
}