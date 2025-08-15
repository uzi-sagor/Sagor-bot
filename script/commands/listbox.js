module.exports.config = {
  name: "listbox",
  version: "0.0.2",
  permission: 2,
  prefix: true,
  credits: "SaGor",
  description: "sendmsg",
  category: "admin",
  usages: "",
  cooldowns: 5,
};

module.exports.handleReply = async function({ api, event, args, Threads, handleReply }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  const arg = event.body.split(" ");
  const idgr = handleReply.groupid[arg[1] - 1];

  switch (handleReply.type) {
    case "reply":
      if (arg[0].toLowerCase() === "ban") {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 1;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.set(parseInt(idgr), 1);
        api.sendMessage(`✅ [${idgr}] Successfully banned!`, event.threadID, event.messageID);
      }

      if (arg[0].toLowerCase() === "out") {
        await api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
        const tName = (await Threads.getData(idgr)).name || "Unknown";
        api.sendMessage(`🚪 Left thread: ${tName}\nTID: ${idgr}`, event.threadID, event.messageID);
      }
      break;
  }
};

module.exports.run = async function({ api, event, client }) {
  const inbox = await api.getThreadList(100, null, ["INBOX"]);
  const list = inbox.filter(group => group.isSubscribed && group.isGroup);

  const listthread = [];
  for (const groupInfo of list) {
    const data = await api.getThreadInfo(groupInfo.threadID);
    listthread.push({
      id: groupInfo.threadID,
      name: groupInfo.name,
      sotv: data.userInfo.length,
    });
  }

  const listbox = listthread.sort((a, b) => b.sotv - a.sotv);

  let msg = "╔════════════════════╗\n      💠 SAGOR BOT 💠\n╚════════════════════╝\n\n";
  const groupid = [];
  listbox.forEach((group, i) => {
    msg += `🔹 ${i + 1}. ${group.name}\n🧩 TID: ${group.id}\n🐸 Members: ${group.sotv}\n────────────────────\n`;
    groupid.push(group.id);
  });
  msg += `💡 Reply "ban [number]" or "out [number]" to manage threads!\n📜 Credit: SaGor`;

  api.sendMessage(msg, event.threadID, (err, info) =>
    global.client.handleReply.push({
      name: this.config.name,
      author: event.senderID,
      messageID: info.messageID,
      groupid,
      type: "reply"
    })
  );
};
