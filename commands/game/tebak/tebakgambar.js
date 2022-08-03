const { ICommand } = require('@libs/builders/command/command.builder')
const config = require('@config')
const { generateRandomXP } = require('@libs/constants/number')
const axios = require('axios').default

const _collection = new Map()

/**
 * @type { ICommand }
 */
module.exports = {
    cooldown: 20000,
    category: 'game',
    description: 'Game tebak gambar, guest and get exp.',
    callback: async ({ msg, database }) => {
        try {
            const gainedXP = generateRandomXP();
            if (_collection.get(msg.from)) {
                return msg.reply('Please complete last game first.', _collection.get(msg.from))
            }

            const { data } = await axios.get('https://api.lolhuman.xyz/api/tebak/gambar2?apikey={apikey}'.format({ apikey: config.apikey }))
            let question = await msg.replyImage({ url: data.result.image }, 'Time 60 seconds!')

            _collection.set(msg.from, question)
            const collector = msg.createMessageCollector({
                filter: data.result.answer,
                max: 1,
            });

            collector.on('collect', (msg) => {
                database.users.addExp(msg, msg.senderNumber, gainedXP)
                return msg.reply('Benar! Kamu mendapat {xp} XP!'.format({ xp: gainedXP }))
            });

            collector.on('end', (res) => {
                _collection.delete(msg.from)
                if (res == 'timeout') {
                    return msg.reply(`Waktu habis, jawabannya adalah : ${data.result.answer}`, question)
                }
            });
            
        } catch (error) {
            console.log("Error in tebak gambar: ", error)
        }
    },
}
