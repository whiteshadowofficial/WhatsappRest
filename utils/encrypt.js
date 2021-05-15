const {machineIdSync} = require('node-machine-id')
const crypto = require('crypto');
const ENCRYPTION_KEY = machineIdSync().substr(0, 32);
const IV_LENGTH = 16;

module.exports = {
    decrypt: function(text, key) {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        if(key !== undefined && key.length >= 32) {
            decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.substr(0,32)), iv);
        }
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
    encrypt: function(text, key) {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        if(key !== undefined && key.length >= 32) {
            cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.substr(0,32)), iv);
        }
        let encrypted = cipher.update(text);
        
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    },
    machineId: () => machineIdSync(),
    generate: function() {
        var token = crypto.randomBytes(64).toString('hex');
        const hash = crypto.createHmac('sha256', token)
                    .update('WhatAppRest')
                    .digest('hex');
        return hash;
    }
}
