const dotenv = require('dotenv')
const path = require('path')
dotenv.config()

module.exports = {
    rootPath: path.resolve(__dirname, '..'), // Ignore this

    botName: process.env.BOT_NAME,

    limit: process.env.LIMIT,
    timezone: process.env.TIMEZONE,

    ownerName: process.env.OWNER_NAME,
    ownerNumber: process.env.OWNER_NUMBER,

    sessionName: process.env.SESSION_NAME,

    apikey: process.env.APIKEY,
    baseURL: process.env.API_BASE_URL
}
