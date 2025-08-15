module.exports.config = {
    name: "toilet",
    version: "1.0.0",
    permission: 0,
    credits: "SaGor",
    description: " ",
    prefix: true, 
    category: "user", 
    usages: "@",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "canvas": "",
        "jimp": "",
        "node-superfetch": ""
    }
};

module.exports.circle = async (image) => {
    const jimp = global.nodemodule['jimp'];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.run = async ({ event, api, args, Users }) => {
    try {
        const Canvas = global.nodemodule['canvas'];
        const request = global.nodemodule["node-superfetch"];
        const fs = global.nodemodule["fs-extra"];
        const path_toilet = __dirname + '/cache/toilet.png';

        var id = (event.mentions && Object.keys(event.mentions).length > 0) ? Object.keys(event.mentions)[0] : event.senderID;

        const canvas = Canvas.createCanvas(500, 670);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://i.imgur.com/Kn7KpAr.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        let avatarData = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
        let avatar = await this.circle(Buffer.from(avatarData.body, 'binary'));

        ctx.drawImage(await Canvas.loadImage(avatar), 135, 350, 205, 205);

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(path_toilet, imageBuffer);

        api.sendMessage(
            { attachment: fs.createReadStream(path_toilet), body: "🐸🐸" },
            event.threadID,
            () => fs.unlinkSync(path_toilet),
            event.messageID
        );

    } catch (e) {
        api.sendMessage(e.stack, event.threadID);
    }
};
