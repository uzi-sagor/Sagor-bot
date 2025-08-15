module.exports.config = {
  name: "ping",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "SaGor",
  description: "Check bot response time with colorful bar and real-time animation",
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

  let bar = "";
  for (let i = 1; i <= 10; i++) {
    if (i <= filledCount) bar += barColor;
    else bar += "⬜";
    await new Promise(resolve => setTimeout(resolve, 70));
    await api.sendMessage(`🏓 𝗣𝗜𝗡𝗚 𝗧𝗘𝗦𝗧\n⏱️ Response Time: ${latency}ms\n${bar}`, event.threadID);
  }

  let status = "⚡ Fast!";
  if (latency > 200 && latency <= 500) status = "⏱️ Normal";
  if (latency > 500) status = "🐢 Slow";

  api.unsendMessage(loading.messageID);
  api.sendMessage(
    `✨ 𝗣𝗜𝗡𝗚 𝗥𝗘𝗦𝗨𝗟𝗧 ✨\n⏱️ Response Time: ${latency}ms\n${bar}\nStatus: ${status}\n💬 Stay connected!`,
    event.threadID
  );
};
