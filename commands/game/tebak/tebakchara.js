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

            const { data } = await axios.get(`${config.baseURL}tebakchara?apikey={apikey}`.format({ apikey: config.apikey }))
            let question = await msg.replyImage({ url: data.result.image }, 'Siapakah dia ?\nWaktumu 60 detik!');

            _collection.set(msg.from, question)
            const collector = msg.createMessageCollector({
                filter: data.result.name.toLowerCase(),
                max: 1,
            });

            collector.on('collect', (msg) => {
                database.users.addExp(msg, msg.senderNumber, gainedXP)
                return msg.reply('Right! You received {xp} XP!'.format({ xp: gainedXP }))
            });

            collector.on('end', (res) => {
                _collection.delete(msg.from)
                if (res == 'timeout') {
                    return msg.reply(`Timeout, answer is : ${data.result.name}`, question)
                }
            });

        } catch (error) {
            console.log("Error in tebak chara: ", error)
        }
    },
}
