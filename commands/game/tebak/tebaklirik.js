const { ICommand } = require('@libs/builders/command/command.builder')
const config = require('@config')
const { generateRandomXP } = require('@libs/constants/number')
const axios = require('axios').default

const _collection = new Map()

/**
 * @type { ICommand }
 */
module.exports = {
    cooldown: 10 * 1000,
    category: 'game',
    description: 'Game tebak lirik, jawab lirik yg kosong dan dapatkan XP!',
    callback: async ({ msg, database }) => {
        try {
            const gainedXP = generateRandomXP();
            if (_collection.get(msg.from)) {
                return msg.reply('Please complete last game first.', _collection.get(msg.from))
            }

            const { data } = await axios.get(`${config.baseURL}tebak/lirik?apikey={apikey}`.format({ apikey: config.apikey }))
            const { result } = data;
            let message = `*${result.question}*\n\nLanjutkan lirik lagu tersebut!\nWaktu kalian 1 menit!`
            let question = await msg.reply(message);
            _collection.set(msg.from, question)

            const collector = msg.createMessageCollector({
                filter: result.answer,
                max: 1,
            });

            collector.on('collect', (msg) => {
                database.users.addExp(msg, msg.senderNumber, gainedXP)
                msg.reply('*Benar!* Kamu mendapatkan {xp} XP!'.format({ gainedXP }))
            });

            collector.on('end', (res) => {
                _collection.delete(msg.from)
                if (res == 'timeout') {
                    msg.reply(`*Waktu habis!*\nJawabannya adalah: ${result.answer}`, question)
                }
            });

        } catch (error) {
            console.log("Error in tebak lirik: ", error)
        }
    },
}
