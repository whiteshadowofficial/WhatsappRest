const {validatePhone,formatPhone} = require('../../utils/funcs')
var wp = null;


async function run (req, res) {
    try {
        if(!req.params.number || !req.body.message) {
            return res.send({
                error: true,
                code: 'INVALID_REQUEST'
            });
        }
        if(validatePhone(req.params.number)) {
            const number = formatPhone(req.params.number)
            await wp.sendTextMessage(number, req.body.message);
            res.send({
                success: true
            })
        }
        else {
            res.send({
                error: true,
                code: 'INVALID_PHONE'
            })
        }
    }
    catch(err) {
        res.send({
            error: true,
            code: 'ERROR',
            message: err.message
        })
    }
}

module.exports = function (_wp) {
    wp = _wp;
    return run;
}