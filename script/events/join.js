const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "1.3.2",
  credits: "SaGor",
  description: "Send welcome message with image, only name (no tag, no ID)",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "axios": ""
  }
};

module.exports.onLoad = async function () {
  const dir = path.join(__dirname, "cache", "joinGif");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

async function downloadImage(url, filepath) {
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;
  const botID = api.getCurrentUserID();

  const currentTime = new Date().toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    hour12: true,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  const driveImageUrl = "https://drive.google.com/uc?export=download&id=1IR02IDIgjGYkt_pHCjF-FrgdsJIT1QKt";
  const botImagePath = path.join(__dirname, "cache", "joinGif", "bot_join.jpg");

  const driveImageUrl = "https://drive.google.com/uc?export=download&id=1ILe15KqC3kOcEaNnD_euTLy9LIj-CLBO";
  const welcomeImagePath = path.join(__dirname, "cache", "joinGif", "welcome.jpg");

  // BOT joined group
  if (event.logMessageData.addedParticipants.some(user => user.userFbId === botID)) {
    if (!fs.existsSync(botImagePath)) {
      try {
        await downloadImage(driveImageUrl, botImagePath);
      } catch (e) {
        console.error("Bot profile download error:", e);
      }
    }

    await api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "BOT"}`, threadID, botID);

    const botJoinMsg =
`✅ 𝐁𝐨𝐭 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!

╭╼|━━━━━━━━━━━━━━|╾╮
👑 𝗔𝗱𝗺𝗶𝗻: 𝐉𝐀𝐇𝐈𝐃𝐔𝐋 𝐈𝐒𝐋𝐀𝐌 𝐒𝐀𝐆𝐎𝐑
🌐 𝗡𝗮𝗺𝗲: 𝐒𝐀𝐆𝐎𝐑 𝐈𝐒𝐋𝐀𝐌
📧 𝗘𝗺𝗮𝗶𝗹: babygithub@gmail.com
📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: +8801611079915
✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: t.me/xxSaGorxx
🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/SAGOR.DJK.FORYOU
⏰ 𝗧𝗶𝗺𝗲: ${currentTime}
╰╼|━━━━━━━━━━━━━━|╾╯`;

    return api.sendMessage({
      body: botJoinMsg,
      attachment: fs.createReadStream(botPicPath)
    }, threadID);
  }

  // OTHER USERS joined group
  try {
    const addedUsers = event.logMessageData.addedParticipants;

    if (!fs.existsSync(welcomeImagePath)) {
      try {
        await downloadImage(driveImageUrl, welcomeImagePath);
      } catch (e) {
        console.error("Welcome image download error:", e);
      }
    }

    let threadInfo = {};
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (e) {
      console.error("Failed to get thread info:", e);
    }

    const groupName = threadInfo.threadName || "Unknown Group";
    const memberCount = threadInfo.participantIDs ? threadInfo.participantIDs.length : 0;

    // Only show names, no ID, no tag
    let nameList = [];
    addedUsers.forEach(user => {
      if (user.userFbId !== event.author) {
        nameList.push(`${user.fullName}`);
      }
    });

    const welcomeMsg = `
╭─❍❍❍───────────╮
│ 🦋 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓝𝓮𝔀 𝓢𝓽𝓪𝓻 🦋 │
╰─❍❍❍───────────╯

✨🌸❝ 𝓝𝓮𝔀 𝓜𝓮𝓶𝓫𝓮𝓻 ❞🌸✨  

${nameList.join("\n")}

🏷️ 𝓖𝓻𝓸𝓾𝓹: "${groupName}"

👥 𝓣𝓸𝓽𝓪𝓵 𝓜𝓮𝓶𝓫𝓮𝓻𝓼: ${memberCount}

⏰ 𝓣𝓲𝓶𝓮: ${currentTime}

╭╼|━━━━━━━━━━━━━━|╾╮
🤖 𝐅𝐫𝐨𝐦 𝐒𝐀𝐆𝐎𝐑 𝐁𝐎𝐓
╰╼|━━━━━━━━━━━━━━|╾╯
`;

    return api.sendMessage({
      body: welcomeMsg,
      attachment: fs.createReadStream(welcomeImagePath)
    }, threadID);

  } catch (error) {
    console.error("Join error:", error);
  }
};
