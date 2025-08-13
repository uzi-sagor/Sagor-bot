module.exports.config = {
    name: "bot",
    version: "2.0.0",
    permission: 0,
    credits: "Sagor",
    description: "No prefix random bot reply (2000% Fixed)",
    prefix: false,
    premium: false,
    category: "fun",
    usages: "",
    cooldowns: 2
};

module.exports.handleEvent = function ({ event, api }) {
    if (!event.body) return;
    const msg = event.body.toLowerCase();
    const triggerWords = ["bot", "বট"];
    if (triggerWords.some(word => msg.includes(word))) {
        const replies = [
            "হ্যাঁ বলো?",
            "আচ্ছা, আমি শুনছি।",
            "কি খবর?",
            "আমি তো আছি 😊",
            "তুমি খুব মিষ্টি কথা বলো ❤️",
            "ওহো, ডেকেছো নাকি?",
            "আমাকে ডাকলে আমি আসবই!",
            "বলো বলো, কী দরকার?"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        return api.sendMessage(randomReply, event.threadID, event.messageID);
    }
};

module.exports.run = function () {};
