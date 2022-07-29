const { ICommand } = require('@libs/builders/command/command.builder')
const { lolhuman } = require('@libs/constants/api/api.constant');
const sleep = require('@libs/utils/sleep');
const config = require('@config')

/**
 * @type { ICommand }
 */
module.exports = {
    aliases: ['spotsearch', 'spots'],
    category: 'spotify',
    description: 'Spotify Search',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<string>',
    example: '{prefix}{command} thefatrat',
    callback: async ({ msg, args }) => {
        try {
            const result = await lolhuman.spotifySearch(args.join(' '));
            var sections = [
                {
                    title: "Search result of " + args.join(' '),
                    rows: [
                    ],
                }
            ]
            result.forEach((value, index) => {
                sections[0].rows.push({
                    title: value.artists + " - " + value.title,
                    rowId: `/spdl ${value.link}`,
                })
            })
            let title = `Search result of ${args.join(' ')}`
            let text = `To download the song, select the song and click the button below`
            let footer = `© ${config.botName} Bot`
            let buttonText = 'Download'
            await sleep(2000);
            return await msg.replyList(text, buttonText, sections, title, footer);
            // return msg.replyVideo({ url: result })
        } catch (error) {
            console.log("Error in spotify search: ", error)
            return msg.reply("Error occured, please try again, or contact the bot owner");
        }
    },
}