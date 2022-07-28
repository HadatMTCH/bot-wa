const { ICommand } = require('@libs/builders/command/command.builder')
const { lolhuman } = require('@libs/constants/api/api.constant')

/**
 * @type { ICommand }
 */
module.exports = {
    aliases: ['igdl', 'ig'],
    category: 'instagram',
    description: 'Instagram Downloader',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://www.instagram.com/p/CggbFdijK6G',
    callback: async ({ msg, args }) => {
        try {
            const result = await lolhuman.instagram(args[0])
            return msg.replyVideo({ url: result })
        } catch (error) {
            console.log("Error in tiktok video downloader: ",error)
        }
    },
}