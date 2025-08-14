module.exports.config = {
    name: "tid",
    version: "1.0.0",
    permission: 0,
    credits: "Sagor",
    description: "Show Thread ID (prefix & no-prefix supported)",
    prefix: false,
    premium: false,
    category: "system",
    usages: "",
    cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;

    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const threadName = threadInfo.threadName || "Unnamed Group";

        const msg = 
`✨💬 THREAD INFO 💬✨

📝 Name : ${threadName}
🆔 TID  : ${threadID}

────────────────────────────`;

        return api.sendMessage(msg, threadID, messageID);
    } catch (e) {
        return api.sendMessage(`❌ Unable to fetch Thread ID`, threadID, messageID);
    }
};
