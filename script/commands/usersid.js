module.exports.config = {
    name: "uid",
    version: "1.5.0",
    permission: 0,
    credits: "Sagor",
    description: "Show UID with username (prefix & no-prefix supported)",
    prefix: false,
    premium: false,
    category: "system",
    usages: "[reply / mention / self]",
    cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply } = event;

    let userID = (event.type === "message_reply" && messageReply.senderID) ? messageReply.senderID : (args[0] || senderID);

    try {
        const userInfo = await api.getUserInfo(userID);
        const name = userInfo[userID]?.name || "Unknown";

        const msg = `✨🆔 UID INFO 🆔✨\n\n📝 Name : ${name}\n🆔 UID  : ${userID}\n────────────────────────────`;

        return api.sendMessage(msg, threadID, messageID);
    } catch (e) {
        return api.sendMessage(`❌ Unable to fetch UID for ${userID}`, threadID, messageID);
    }
};
