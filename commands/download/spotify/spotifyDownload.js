const { ICommand } = require('@libs/builders/command/command.builder')
const { lolhuman } = require('@libs/constants/api/api.constant');

/**
 * @type { ICommand }
 */
module.exports = {
    aliases: ['spdl', 'spotdl'],
    category: 'spotify',
    description: 'Spotify Download',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<string>',
    example: '{prefix}{command} https://open.spotify.com/track/0saGACKtFP1ZVW4Nd4IkCw',
    callback: async ({ msg, args }) => {
        try {
            const result = await lolhuman.spotify(args[0]);
            await msg.replyImage({ url: result.thumbnail }, `${result.artists} - ${result.title}`)
            await msg.replyAudio({ url: result.link })
        } catch (error) {
            console.log("Error in spotify download: ", error)
            return msg.reply("Error occured, please try again, or contact the bot owner");
        }
    },
}