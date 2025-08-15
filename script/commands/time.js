module.exports.config = {
  name: "time",
  version: "1.0.0",
  permission: 0,
  credits: "SaGor",
  description: "Check current local time in stylish format",
  prefix: true,
  premium: false,
  category: "User",
  usages: "time",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const moment = require("moment-timezone");
  const now = moment().tz("Asia/Dhaka");

  const day = now.format("dddd");
  const date = now.format("MMMM Do YYYY");
  const time = now.format("HH:mm:ss");

  const hour = now.hour();
  let greeting = "🌙 Good Night";
  let barColor = "🟦";

  if(hour >= 5 && hour < 12) {
    greeting = "🌞 Good Morning";
    barColor = "🟩";
  } else if(hour >= 12 && hour < 17) {
    greeting = "☀️ Good Afternoon";
    barColor = "🟨";
  } else if(hour >= 17 && hour < 20) {
    greeting = "🌇 Good Evening";
    barColor = "🟧";
  }

  const filled = Math.floor((hour / 24) * 10);
  const empty = 10 - filled;
  const bar = barColor.repeat(filled) + "⬜".repeat(empty);

  const timeCard = `
${greeting} ⏰
📅 Day  : ${day}
📆 Date : ${date}
🕒 Time : ${time}
Progress: ${bar}
`;

  api.sendMessage(timeCard, event.threadID);
};
