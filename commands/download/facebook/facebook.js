const { ICommand } = require('@libs/builders/command/command.builder')
const { lolhuman } = require('@libs/constants/api/api.constant')

/**
 * @type { ICommand }
 */
module.exports = {
    aliases: ['fbdl', 'fb'],
    category: 'facebook',
    description: 'Facebook Downloader',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://www.facebook.com/KonowxD/videos/5222624587836098',
    callback: async ({ msg, args }) => {
        try {
            const result = await lolhuman.facebook(args[0])
            return msg.replyVideo({ url: result })
        } catch (error) {
            console.log("Error in facebook video downloader: ",error)
            return msg.reply("Please make sure the url is correct / public");
        }
    },
}