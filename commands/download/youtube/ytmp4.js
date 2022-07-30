const { youtube } = require('@libs/utils/scrapper/download/youtube')
const { ICommand } = require('@libs/builders/command/command.builder')

/**
 * @type { ICommand }
 */
module.exports = {
    cooldown: 10000,
    aliases: ['ytv', 'ytvideo'],
    category: 'youtube',
    description: 'Youtube video downloader.',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://www.youtube.com/watch?v=eZskFo64rs8',
    callback: async ({ msg, args }) => {
        try {
            const result = await youtube(args[0], 'mp4')
            await msg.replyImage({ url: result.thumbnail }, `${result.title} - ${result.size}`)
            await msg.replyVideo({ url: result.link })
            return
        } catch (error) {
            console.log("Error in youtube video downloader: ", error)
        }
    },
}
