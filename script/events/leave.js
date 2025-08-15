module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.1",
	credits: "ryuko + styled by Sagor",
	description: "Notify when someone leaves or gets removed with fancy styles",
};

module.exports.run = async function({ api, event, Users, Threads }) {
	try {
		if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

		const { threadID } = event;
		const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
		const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
		const type = (event.author == event.logMessageData.leftParticipantFbId)
			? "🚶‍♂️ Left the group voluntarily"
			: "🛑 Was removed from the group";

		const leaveStyles = [
			`╔══❖•💔•❖══╗\n💌 Farewell, ${name}\n${type}\n🌸 See you soon 🌸\n╚══❖•💔•❖══╝`,
			`┏━━━━━━━━━━━━━━┓\n💌 Goodbye ${name}!\n${type}\n✨ Best wishes! ✨\n┗━━━━━━━━━━━━━━┛`,
			`╔═🌟═🌟═╗\n👋 ${name} has left\n${type}\n🌸 Welcome back anytime 🌸\n╚═🌟═🌟═╝`,
			`░▒▓█►─═✦✦✦═─◄█▓▒░\n💌 Farewell ${name}\n${type}\n🌸 Hope to see you again 🌸\n░▒▓█►─═✦✦✦═─◄█▓▒░`,
			`💐🌸🌼🌸💐\nFarewell ${name}\n${type}\n🌸 See you again 🌸`,
			`╔═✦✦✦═╗\n💔 ${name} left\n${type}\n🌟 See you soon 🌟\n╚═✦✦✦═╝`,
			`🔹🔹🔹\n👋 Bye Bye ${name}\n${type}\n🔹🔹🔹`,
			`✨✨✨✨\n💌 Goodbye ${name}\n${type}\n🌸✨🌸\n✨✨✨✨`,
			`🖤🖤🖤\n${name} has left\n${type}\n🖤🖤🖤`,
			`🌈🌸🌟🌸🌈\nFarewell ${name}\n${type}\n🌸🌟🌸🌈`,
			`📦📦📦\n📤 ${name}\n${type}\n📦📦📦`,
			`💎💎💎\n✨ Goodbye ${name} ✨\n${type}\n💎💎💎`
		];

		let msg = (typeof data.customLeave == "undefined") 
			? leaveStyles[Math.floor(Math.random() * leaveStyles.length)]
			: data.customLeave.replace(/\{name}/g, name).replace(/\{type}/g, type);

		return api.sendMessage({ body: msg }, threadID);
	} catch (err) {}
};
