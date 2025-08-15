module.exports.config = {
  name: "video1",
  version: "1.0.0",
  permission: 0,
  credits: "SaGor",
  description: "Random modof video",
  prefix: true,
  category: "Media",
  usages: "video",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "request": ""
  }
};

module.exports.run = async ({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  var hi = ["<অনেক কষ্টের ভিডিও দেখলে মনে কেমন জানি লাগে 🥺--SAGOR--"];
  var know = hi[Math.floor(Math.random() * hi.length)];
  var link = [
    "https://i.imgur.com/LupVmqF.mp4",
    "https://i.imgur.com/X2VK9vI.mp4",
    "https://i.imgur.com/xQVkQEi.mp4",
    "https://i.imgur.com/g0dIIG4.mp4",
    "https://i.imgur.com/IiN24GD.mp4",
    "https://i.imgur.com/dsuI4ml.mp4",
    "https://i.imgur.com/Ap1Z722.mp4",
    "https://i.imgur.com/GNUQgOF.mp4",
    "https://i.imgur.com/SAFUoXg.mp4"
  ];

  var callback = () => {
    api.sendMessage({ body: `「 ${know} 」`, attachment: fs.createReadStream(__dirname + "/cache/15.mp4") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4"));
  };

  return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/15.mp4")).on("close", () => callback());
};
