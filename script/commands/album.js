const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://nix-album-api.vercel.app";
const IMGUR_API = "https://aryan-nix-apis.vercel.app/api/imgur";

module.exports.config = {
    name: "album",
    version: "1.0.1",
    permission: 0,
    credits: "ArYAN",
    description: "Album video system",
    prefix: true,
    premium: false,
    category: "media",
    usages: "{p}album [page/add/list]",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    
    if (args[0] === "add") {
        if (!args[1]) {
            return api.sendMessage("[⚜️]➜ Please specify a category. Usage: !album add [category] [video_url] or reply to a video.", threadID, messageID);
        }

        const category = args[1].toLowerCase();
        let videoUrl = args[2];

        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
            const attachment = event.messageReply.attachments[0];
            if (attachment.type !== "video") {
                return api.sendMessage("[⚜️]➜ Only video attachments are allowed.", threadID, messageID);
            }
            videoUrl = attachment.url;
        }

        if (!videoUrl) {
            return api.sendMessage("[⚜️]➜ Please provide a video URL or reply to a video message.", threadID, messageID);
        }

        try {
            const imgurResponse = await axios.get(IMGUR_API, { params: { url: videoUrl } });

            if (!imgurResponse.data || !imgurResponse.data.imgur) {
                throw new Error("Imgur upload failed. No URL returned from the API.");
            }

            const imgurLink = imgurResponse.data.imgur;
            const addResponse = await axios.post(`${API_BASE}/api/album/add`, { category, videoUrl: imgurLink });

            return api.sendMessage(addResponse.data.message, threadID, messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage(`[⚜️]➜ Failed to add video.\nError: ${error.response?.data?.error || error.message}`, threadID, messageID);
        }
    }

    
    if (args[0] === "list") {
        try {
            const response = await axios.get(`${API_BASE}/api/category/list`);
            if (response.data.success) {
                const categories = response.data.categories.map((cat, index) => `${index + 1}. ${cat}`).join("\n");
                return api.sendMessage(`𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐞𝐬:\n\n${categories}`, threadID, messageID);
            } else {
                return api.sendMessage(`[⚜️]➜ Failed to fetch categories.\nError: ${response.data.error}`, threadID, messageID);
            }
        } catch {
            return api.sendMessage(`[⚜️]➜ Error while fetching categories from the API. Please try again later.`, threadID, messageID);
        }
    }

    
    const categoriesInJson = ["funny", "islamic", "sad", "anime", "lofi", "attitude", "ff", "love"];
    const displayNames = ["𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨", "𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨", "𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨", "𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐅𝐟 𝐕𝐢𝐝𝐞𝐨", "𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨"];
    const captions = [
        "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😺",
        "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <✨",
        "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😢",
        "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
        "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎶",
        "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <☠️",
        "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐟 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎮",
        "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <💖"
    ];

    const itemsPerPage = 8;
    const page = parseInt(args[0]) || 1;
    const totalPages = Math.ceil(displayNames.length / itemsPerPage);

    if (page < 1 || page > totalPages) {
        return api.sendMessage(`[⚜️]➜ Invalid page! Please choose between 1 - ${totalPages}.`, threadID, messageID);
    }

    const startIndex = (page - 1) * itemsPerPage;
    const displayedCategories = displayNames.slice(startIndex, startIndex + itemsPerPage);

    let msg = `𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨𝐬 🎀\n`;
    msg += "𐙚━━━━━━━━━━━━━━━━━ᡣ𐭩\n";
    msg += displayedCategories.map((name, i) => `${i + 1}. ${name}`).join("\n");
    msg += `\n𐙚━━━━━━━━━━━━━━━━━ᡣ𐭩\n♻ | 𝐏𝐚𝐠𝐞 [${page}/${totalPages}]`;

    api.sendMessage(msg + `\n\nReply with a number to get the video.`, threadID, (err, info) => {
        global.client.handleReply.push({
            name: module.exports.config.name,
            author: senderID,
            messageID: info.messageID,
            type: "category",
            categoriesInJson,
            captions
        });
    }, messageID);
};


module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    if (parseInt(senderID) !== parseInt(handleReply.author)) return;

    if (handleReply.type === "category") {
        api.unsendMessage(handleReply.messageID);

        const index = parseInt(body) - 1;
        if (isNaN(index) || index < 0 || index >= handleReply.categoriesInJson.length) {
            return api.sendMessage("Please reply with a valid number from the list.", threadID, messageID);
        }

        const category = handleReply.categoriesInJson[index];
        const caption = handleReply.captions[index];

        try {
            const res = await axios.get(`${API_BASE}/api/album/videos/${category}`);
            if (!res.data.success || !res.data.videos?.length) {
                return api.sendMessage("[⚜️]➜ No videos found for this category.", threadID, messageID);
            }

            const randomVideoUrl = res.data.videos[Math.floor(Math.random() * res.data.videos.length)];
            const filePath = path.join(__dirname, "temp_video.mp4");

            const videoStream = await axios({ url: randomVideoUrl, method: "GET", responseType: "stream" });
            const writer = fs.createWriteStream(filePath);
            videoStream.data.pipe(writer);

            writer.on("finish", () => {
                api.sendMessage({ body: caption, attachment: fs.createReadStream(filePath) }, threadID, () => {
                    fs.unlinkSync(filePath);
                }, messageID);
            });
        } catch (err) {
            console.error(err);
            api.sendMessage("[⚜️]➜ Failed to fetch or send the video.", threadID, messageID);
        }
    }
};
