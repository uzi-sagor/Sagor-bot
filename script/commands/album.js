const axios = require("axios");
const fs = require("fs");
const path = require("path");

const aryanAPI = "https://nix-album-api.vercel.app";
const nixAPI = "https://aryan-nix-apis.vercel.app/api/imgur";

module.exports.config = {
    name: "album",
    version: "1.0.0",
    permission: 0,
    credits: "ArYAN",
    description: "View, add, and list album videos from categories",
    prefix: true,
    premium: false,
    category: "media",
    usages: "{p}album [page number] | {p}album add [category] [video_url] | {p}album list",
    cooldowns: 3
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { realCategories, captions, messageID, author } = handleReply;
    if (event.senderID != author) return;

    api.unsendMessage(messageID);

    const replyNum = parseInt(event.body);
    const index = replyNum - 1;
    if (isNaN(replyNum) || index < 0 || index >= realCategories.length) {
        return api.sendMessage("Please reply with a valid number from the list.", event.threadID, event.messageID);
    }

    const category = realCategories[index];
    const caption = captions[index];

    try {
        const response = await axios.get(`${aryanAPI}/api/album/videos/${category}`);
        if (!response.data.success) {
            return api.sendMessage(response.data.message, event.threadID, event.messageID);
        }

        const videoUrls = response.data.videos;
        if (!videoUrls || videoUrls.length === 0) {
            return api.sendMessage("[⚜️]➜ No videos found for this category.", event.threadID, event.messageID);
        }

        const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
        const filePath = path.join(__dirname, "temp_video.mp4");

        const downloadFile = async (url, filePath) => {
            const response = await axios({
                url,
                method: "GET",
                responseType: "stream",
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            return new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);
                writer.on("finish", resolve);
                writer.on("error", reject);
            });
        };

        await downloadFile(randomVideoUrl, filePath);
        api.sendMessage(
            { body: caption, attachment: fs.createReadStream(filePath) },
            event.threadID,
            () => fs.unlinkSync(filePath),
            event.messageID
        );
    } catch (err) {
        api.sendMessage("[⚜️]➜ Error while fetching or downloading the video.", event.threadID, event.messageID);
    }
};

module.exports.run = async function ({ api, event, args }) {
    if (args[0] === "add") {
        if (!args[1]) {
            return api.sendMessage("[⚜️]➜ Please specify a category.\nUsage: album add [category] [video_url] or reply to a video.", event.threadID, event.messageID);
        }

        const category = args[1].toLowerCase();
        let videoUrl = args[2];

        if (event.messageReply && event.messageReply.attachments?.length > 0) {
            const attachment = event.messageReply.attachments[0];
            if (attachment.type !== "video") {
                return api.sendMessage("[⚜️]➜ Only video attachments are allowed.", event.threadID, event.messageID);
            }
            videoUrl = attachment.url;
        }

        if (!videoUrl) {
            return api.sendMessage("[⚜️]➜ Please provide a video URL or reply to a video message.", event.threadID, event.messageID);
        }

        try {
            const imgurResponse = await axios.get(nixAPI, { params: { url: videoUrl } });
            if (!imgurResponse.data?.imgur) {
                throw new Error("Imgur upload failed.");
            }

            const imgurLink = imgurResponse.data.imgur;
            const addResponse = await axios.post(`${aryanAPI}/api/album/add`, { category, videoUrl: imgurLink });
            return api.sendMessage(addResponse.data.message, event.threadID, event.messageID);
        } catch (error) {
            return api.sendMessage(`[⚜️]➜ Failed to add video.\nError: ${error.response?.data?.error || error.message}`, event.threadID, event.messageID);
        }

    } else if (args[0] === "list") {
        try {
            const response = await axios.get(`${aryanAPI}/api/category/list`);
            if (response.data.success) {
                const categories = response.data.categories.map((cat, i) => `${i + 1}. ${cat}`).join("\n");
                return api.sendMessage(`Available Album Categories:\n\n${categories}`, event.threadID, event.messageID);
            } else {
                return api.sendMessage(`[⚜️]➜ Failed to fetch categories.\nError: ${response.data.error}`, event.threadID, event.messageID);
            }
        } catch {
            return api.sendMessage("[⚜️]➜ Error while fetching categories from the API.", event.threadID, event.messageID);
        }

    } else {
        const categoriesInJson = ["funny", "islamic", "sad", "anime", "lofi", "attitude", "ff", "love"];
        const displayNames = [
            "𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨",
            "𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨",
            "𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨",
            "𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨",
            "𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨",
            "𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨",
            "𝐅𝐟 𝐕𝐢𝐝𝐞𝐨",
            "𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨"
        ];

        const page = parseInt(args[0]) || 1;
        const itemsPerPage = 8;
        const totalPages = Math.ceil(displayNames.length / itemsPerPage);

        if (page < 1 || page > totalPages) {
            return api.sendMessage(`[⚜️]➜ Invalid page! Please choose between 1 - ${totalPages}.`, event.threadID, event.messageID);
        }

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedCategories = displayNames.slice(startIndex, endIndex);

        const message =
            `Available Album Video List 🎀\n` +
            "━━━━━━━━━━━━━━━━━\n" +
            displayedCategories.map((opt, i) => `${startIndex + i + 1}. ${opt}`).join("\n") +
            "\n━━━━━━━━━━━━━━━━━" +
            `\nPage [${page}/${totalPages}]${page < totalPages ? `\nType: album ${page + 1} to see next page.` : ""}`;

        api.sendMessage(message, event.threadID, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                realCategories: categoriesInJson,
                captions: [
                    "Here your Funny Video 😺",
                    "Here your Islamic Video ✨",
                    "Here your Sad Video 😢",
                    "Here your Anime Video 🌟",
                    "Here your LoFI Video 🎶",
                    "Here your Attitude Video ☠️",
                    "Here your FF Video 🎮",
                    "Here your Love Video 💖"
                ],
                author: event.senderID
            });
        }, event.messageID);
    }
};
