module.exports.config = {
  name: "goiadmin1",
    version: "1.0.0",
    permission: 0,
    credits: "SaGor",
    description: "mention",
    prefix: true,
    category: "user",
    usages: "tag",
    cooldowns: 5,
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "61577173906904") {
    var aid = ["61577173906904"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = [",আর পারলামনা bot bot করতে করতে এখন মেনশন দেয়া শুরু করছে 🙂",  "আছি আছি এতো মেনশন দিতে হবেনা😌", " দারা তোদের একটা ব্যবস্হা নিতে হবে খালি ডাকে আর ডাকে 🥲", "আবে সালা তোরা নেকামি করবি আর আমাকে মেনশন দিবি কেন, আমার বসকে মেনশন দে😌", "Assalamu Walaikum আপনি জদি মে হন তাহলে বেশী করে সাগর বসকে মেনশন দেন আমাকে নাহ ওকে🥵🙈", " তুই আর কতো জালাবি একটু বলবি🥵🥰😍😏","আমাকে মেনশন না দিয়ে আমার বস এর জন্য জি এফ দাও"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
}
