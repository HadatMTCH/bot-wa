const { ICommand } = require('@libs/builders/command/command.builder')
const config = require('@config')
const axios = require('axios').default

/**
 * @type { ICommand }
 */
module.exports = {
    cooldown: 60000,
    category: 'primbon',
    description: 'Calculate jodoh',
    minArgs: 2,
    expectedArgs: "<name1> <name2>",
    example: '{prefix}{command} [name1] [name2]',
    callback: async ({ msg, args }) => {
        try {
            const { data } = await axios.get(`${config.baseURL}jodoh/{name1}/{name2}?apikey={apikey}`.format({ apikey: config.apikey, name1: args[0], name2: args[1] }));
            let messageBuilder = `Positif: ${data.result.positif}\n Negatif: ${data.result.negatif}\n\n${data.result.deskripsi}`;
            return await msg.replyImage({ url: data.result.image }, messageBuilder)
        } catch (error) {
            console.log("Error in jodoh: ",error)
            return msg.reply("Please try again or stop bucin");
        }
    },
}