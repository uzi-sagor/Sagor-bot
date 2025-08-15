module.exports = {
  config: {
    name: "out",
  version: "1.0.5",
  credits: "sagor",
  prefix: false,
  permission: 2,
  description: "out bot",
  category: "admin",
  cooldowns: 5
},

start: async function({ sagor, events, args }) {
        if (!args[0]) return sagor.removeUserFromGroup(sagor.getCurrentUserID(), events.threadID);
  sagor.reply("তর হেডার গুরুপে না থাকলে আমার বাল ছিরে গেলো 🖕🏻", events.threadID)
        if (!isNaN(args[0])) return sagor.removeUserFromGroup(sagor.getCurrentUserID(), args.join(" "));
}
}
