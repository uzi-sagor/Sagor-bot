module.exports.config = {
  name: "ping",
  version: "1.0.0",
  credits: "SaGor",
  description: "Check bot response time with stylish colored bar",
  commandCategory: "user",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const sendTime = Date.now();
  const msg = await api.sendMessage("🏓 Pinging... ⏳", event.threadID);

  const latency = Date.now() - sendTime;

  let barColor = "🟩";
  if (latency > 200 && latency <= 500) barColor = "🟨";
  if (latency > 500) barColor = "🟥";

  const filledCount = Math.min(Math.floor(latency / 50), 10);
  const emptyCount = 10 - filledCount;
  const bar = barColor.repeat(filledCount) + "⬜".repeat(emptyCount);

  let status = "⚡ Fast!";
  if (latency > 200 && latency <= 500) status = "⏱️ Normal";
  if (latency > 500) status = "🐢 Slow";

  try {
    await api.unsendMessage(msg.messageID);
  } catch (e) {}

  api.sendMessage(
    `✨ 𝗣𝗜𝗡𝗚 𝗥𝗘𝗦𝗨𝗟𝗧 ✨\n⏱️ Response Time: ${latency}ms\n${bar}\nStatus: ${status}\n💬 Stay connected!`,
    event.threadID
  );
};
