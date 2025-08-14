module.exports.config = {
    name: "emojimix",
    version: "1.0.1",
    permission: 0,
    credits: "Sagor",
    description: "Mix two emojis together into a sticker",
    prefix: true,
    premium: false,
    category: "fun",
    usages: "[emoji1] [emoji2]",
    cooldowns: 3
};

const axios = require("axios");

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (args.length < 2) {
        return api.sendMessage("❌ Please provide 2 emojis.\nExample: .emojimix 😍 🤩", threadID, messageID);
    }

    const emoji1 = encodeURIComponent(args[0]);
    const emoji2 = encodeURIComponent(args[1]);

    try {
        const res = await axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyDCv-AtdGXYPI6PjXv0dV7xQh3J2zL4t5s&client_key=emoji_kitchen_fun&collection=emoji_kitchen_v5&contentfilter=high&q=${emoji1}_${emoji2}`);
        
        if (!res.data.results || res.data.results.length === 0) {
            return api.sendMessage("❌ No mix found for these emojis.", threadID, messageID);
        }

        const img = res.data.results[0].media_formats.png_transparent.url;

        return api.sendMessage({
            body: `✨ Emoji Mix: ${args[0]} + ${args[1]}`,
            attachment: await global.utils.getStreamFromURL(img)
        }, threadID, messageID);

    } catch (err) {
        return api.sendMessage("❌ Error fetching emoji mix. Try different emojis.", threadID, messageID);
    }
};
