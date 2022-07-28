const config = require('@config')
const { ICommand } = require('@libs/builders/command/command.builder')
const axios = require('axios').default

const sticker = axios.create({
    baseURL: 'https://sticker-api-tpe3wet7da-uc.a.run.app',
})

/**
 * @type { ICommand }
 */
module.exports = {
    aliases: ['s'],
    category: 'maker',
    subCategory: 'sticker',
    description: 'Sticker Maker',
    waitMessage: 'Please wait, making sticker...',
    callback: async ({ msg, client, message, prefix, command }) => {
        try {
            const file = (await msg.download('buffer')) || (msg.quoted && (await msg.quoted.download('buffer')));
            let data = {}
            if (msg.typeCheck.isImage || msg.typeCheck.isQuotedImage) {
                data.image = `data:image/jpeg;base64,${file.toString('base64')}`;
                data.stickerMetadata = {
                    pack: 'Made with Love',
                    author: config.botName + ' Bot',
                    keepScale: true,
                    circle: false,
                    removebg: false,
                }
                sticker.post('/prepareWebp', data).then((res) => {
                    client.sendMessage(msg.from, { sticker: Buffer.from(res.data.webpBase64, 'base64') }, { quoted: message })
                })
            } else if (msg.typeCheck.isVideo || msg.typeCheck.isQuotedVideo) {
                data.file = `data:video/mp4;base64,${file.toString('base64')}`;
                data.stickerMetadata = {
                    pack: config.botName,
                    author: 'Bot',
                    keepScale: true,
                };
                data.processOptions = {
                    crop: false,
                    fps: 10,
                    startTime: '00:00:00.0',
                    endTime: '00:00:7.0',
                    loop: 0,
                };
                sticker.post('/convertMp4BufferToWebpDataUrl', data).then((data) => {
                    client.sendMessage(msg.from, { sticker: Buffer.from(data.data.split(';base64,')[1], 'base64') }, { quoted: message })
                })
            } else {
                msg.reply(`Please reply an image or video with ${prefix + command}`)
            }
        } catch (error) {
            console.log("Error in sticker maker: ", error)
        }
    },
}
