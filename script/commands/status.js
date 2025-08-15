module.exports.config = {
  name: "status",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "SaGor",
  description: "Check bot response time with stylish colored bar",
  commandCategory: "user",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const start = Date.now();
  const loading = await api.sendMessage("🏓 Pinging... ⏳", event.threadID);

  const end = Date.now();
  const latency = end - start;

  let barColor = "🟩";
  if (latency > 200 && latency <= 500) barColor = "🟨";
  if (latency > 500) barColor = "🟥";

  let filledCount = Math.min(Math.floor(latency / 50), 10);
  let emptyCount = 10 - filledCount;
  let bar = barColor.repeat(filledCount) + "⬜".repeat(emptyCount);

  let status = "⚡ Fast!";
  if (latency > 200 && latency <= 500) status = "⏱️ Normal";
  if (latency > 500) status = "🐢 Slow";

  await api.unsendMessage(loading.messageID);
  api.sendMessage(
    `✨ 𝗣𝗜𝗡𝗚 𝗥𝗘𝗦𝗨𝗟𝗧 ✨\n⏱️ Response Time: ${latency}ms\n${bar}\nStatus: ${status}\n💬 Stay connected!`,
    event.threadID
  );
};
