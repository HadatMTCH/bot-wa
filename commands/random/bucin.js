const { ICommand } = require('@libs/builders/command/command.builder')
const config = require('@config')
const axios = require('axios').default

/**
 * @type { ICommand }
 */
module.exports = {
    cooldown: 10000,
    category: 'random',
    description: 'Kata kata bucin accak',
    example: '{prefix}{command}',
    callback: async ({ msg, args }) => {
        try {
            const { data } = await axios.get(`${config.baseURL}random/bucin?apikey={apikey}`.format({ apikey: config.apikey }))
            return msg.reply(data.result);
        } catch (error) {
            console.log("Error in bucin: ",error)
            return msg.reply("Please try again or stop bucin");
        }
    },
}