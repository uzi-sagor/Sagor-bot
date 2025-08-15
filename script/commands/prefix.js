module.exports.config = {
  name: "prefix",
  version: "1.1.0",
  permission: 0,
  credits: "ryuko + modified by Sagor",
  prefix: true,
  description: "Show bot prefix & total command count",
  category: "system",
  premium: false,
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads, prefix }) => {
  const { threadID, messageID, body } = event;
  const arr = ["mpre", "mprefix", "prefix", "command mark", "What is the prefix of the bot?", "PREFIX"];

  arr.forEach(async i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() || body === i || str === body) {

      const totalCmd = global.client.commands.size || 0;

      const msg = 
`╔════════════════════╗
       💠 SAGOR BOT 💠
╚════════════════════╝

📌 Bot Prefix: 「 ${prefix} 」
📊 Total Commands: ${totalCmd}

━━━━━━━━━━━━━━━━━━━━━
💡 Use "${prefix}help" to see all commands!
━━━━━━━━━━━━━━━━━━━━━`;

      return api.sendMessage(msg, threadID, messageID);
    }
  });
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage("No prefix commands", event.threadID);
};
