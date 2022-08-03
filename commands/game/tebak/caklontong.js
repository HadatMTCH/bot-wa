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
    description: '⛔️Perhatian Bukan Teka Teki Biasa, Tapi TEKA TEKI SULIT⛔️\nBuktikan kalau anda memang cerdas dan penuh daya imajinasi.',
    callback: async ({ msg, database }) => {
        try {
            const gainedXP = generateRandomXP();
            if (_collection.get(msg.from)) {
                return msg.reply('Please complete last game first.', _collection.get(msg.from))
            }

            const { data } = await axios.get(`${config.baseURL}tebak/caklontong?apikey={apikey}`.format({ apikey: config.apikey }))
            const { result } = data;
            let message = `*${result.question} ?*\n\nJawab pertanyaan tersebut!\nWaktu kalian 1 menit!`
            let question = await msg.reply(message);
            _collection.set(msg.from, question)
            
            const collector = msg.createMessageCollector({
                filter: data.result.answer.toLowerCase(),
                max: 1,
            });

            collector.on('collect', (msg) => {
                database.users.addExp(msg, msg.senderNumber, gainedXP)
                return msg.reply('Right! You received {xp} XP!'.format({ xp: gainedXP }))
            });

            collector.on('end', (res) => {
                _collection.delete(msg.from)
                if (res == 'timeout') {
                    return msg.reply(`Timeout, answer is : ${data.result.answer}`, question)
                }
            });
        } catch (error) {
            console.log("Error in cak lontong: ", error)
        }
    },
}
