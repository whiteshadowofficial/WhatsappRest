const express = require('express')
const app = express();
const helmet = require('helmet')
const config = require('../utils/config')
const PORT = config.get('PORT');
const HOST = config.get('HOST');
app.use(helmet.hidePoweredBy());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, HOST, () => console.log(`App listening on port ${PORT}!`));

function init(wp)
{
    app.use(require('./routes/middleware')(wp));
    app.post('/sendMessage/:number', require('./routes/sendMessage')(wp))
}


module.exports = init;