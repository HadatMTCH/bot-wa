const { youtube } = require('@libs/utils/scrapper/download/youtube')
const { ICommand } = require('@libs/builders/command/command.builder')

/**
 * @type { ICommand }
 */
module.exports = {
    cooldown: 10000,
    aliases: ['yta', 'ytaudio'],
    category: 'youtube',
    description: 'Youtube audio downloader.',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://www.youtube.com/watch?v=eZskFo64rs8',
    callback: async ({ msg, args }) => {
        try {
            const result = await youtube(args[0], 'mp3')
            await msg.replyImage({ url: result.thumbnail }, `${result.title} - ${result.size}`)
            await msg.replyAudio({ url: result.link })
            return
        } catch (error) {
            console.log("Error in youtube audio downloader: ", error)
        }
    },
}
