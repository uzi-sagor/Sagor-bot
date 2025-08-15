module.exports.config = {
  name: "ping",
  version: "1.0.0",
  permission: 0,
  credits: "SaGor",
  description: "Check bot response time with stylish bar",
  prefix: true,
  premium: false,
  category: "User",
  usages: "ping",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const startTime = Date.now();
  const loadingMsg = await api.sendMessage("🏓 Pinging... ⏳", event.threadID);

  const latency = Date.now() - startTime;

  let barColor = "🟩";
  if (latency > 200 && latency <= 500) barColor = "🟨";
  if (latency > 500) barColor = "🟥";

  const filled = Math.min(Math.floor(latency / 50), 10);
  const empty = 10 - filled;
  const bar = barColor.repeat(filled) + "⬜".repeat(empty);

  let status = "⚡ Fast!";
  if (latency > 200 && latency <= 500) status = "⏱️ Normal";
  if (latency > 500) status = "🐢 Slow";

  try { await api.unsendMessage(loadingMsg.messageID); } catch(e){}

  api.sendMessage(
    `✨ 𝗣𝗜𝗡𝗚 𝗥𝗘𝗦𝗨𝗟𝗧 ✨\n⏱️ Response Time: ${latency}ms\n${bar}\nStatus: ${status}\n💬 Stay connected!`,
    event.threadID
  );
};
