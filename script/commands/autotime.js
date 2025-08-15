module.exports.config = {
    name: "autotime",
    version: "1.0.0",
    permission: 0,
    credits: "SaGor",
    description: "Send stylish scheduled messages based on time",
    prefix: true,
    category: "user",
    usages: "",
    cooldowns: 5,
    dependencies: {}
};

const scheduleMsgs = [
    { timer: '12:00 AM', message: ['🏙️ রাত ১২টা, খাওয়া দাওয়া করে নাও 😙'] },
    { timer: '1:00 AM', message: ['🌙 রাত ১টা, সবাই শুয়ে পড়ো 🤟'] },
    { timer: '2:00 AM', message: ['🛌 রাত ২টা, যারা জেগে আছ তারা ঘুমাও 😾'] },
    { timer: '3:00 AM', message: ['🌌 রাত ৩টা, শান্ত ঘুম হও 🥹'] },
    { timer: '4:00 AM', message: ['⏰ রাত ৪টা, ফজরের নামাজ পড়ো ❤️'] },
    { timer: '5:00 AM', message: ['🌅 ভোর ৫টা, সবাই জাগো 🌞'] },
    { timer: '6:00 AM', message: ['☀️ সকাল ৬টা, ব্রেকফাস্ট করো 😊'] },
    { timer: '7:00 AM', message: ['🥪 সকাল ৭টা, সকালের কাজ শুরু করো'] },
    { timer: '8:00 AM', message: ['💻 সকাল ৮টা, কাজে মন দাও'] },
    { timer: '9:00 AM', message: ['📚 সকাল ৯টা, মন দিয়ে পড়াশোনা করো'] },
    { timer: '10:00 AM', message: ['💖 সকাল ১০টা, সবাইকে মিস করছি ❤️'] },
    { timer: '11:00 AM', message: ['☕ সকাল ১১টা, একটু চা খাও'] },
    { timer: '12:00 PM', message: ['🌞 দুপুর ১২টা, খেয়াল রাখো নিজের'] },
    { timer: '1:00 PM', message: ['🍽️ দুপুর ১টা, খাবার খাও'] },
    { timer: '2:00 PM', message: ['🛁 দুপুর ২টা, গোসল ও বিশ্রাম করো'] },
    { timer: '3:00 PM', message: ['☀️ দুপুর ৩টা, কাজের মধ্যে ব্রেক নাও'] },
    { timer: '4:00 PM', message: ['🌇 বিকাল ৪টা, আসরের নামাজ পড়ো 🥀'] },
    { timer: '5:00 PM', message: ['🌆 বিকাল ৫টা, মাগরিবের জন্য প্রস্তুত হও 😻'] },
    { timer: '6:00 PM', message: ['🌠 সন্ধ্যা ৬টা, পরিবারের সাথে সময় কাটাও 😍'] },
    { timer: '7:00 PM', message: ['🕌 সন্ধ্যা ৭টা, এশার নামাজ পড়ো ❤️'] },
    { timer: '8:00 PM', message: ['🌙 রাত ৮টা, সবাই বিশ্রাম নাও'] },
    { timer: '9:00 PM', message: ['💤 রাত ৯টা, শুতে যাও 🙂'] },
    { timer: '10:00 PM', message: ['🌌 রাত ১০টা, ঘুমানোর সময় 😭'] },
    { timer: '11:00 PM', message: ['🛏️ রাত ১১টা, ভালো ঘুম হও 🌙'] }
];

// Stylish bar generator
const getBar = (hours) => {
    const filled = "🟩".repeat(Math.floor(hours / 2));
    const empty = "⬜".repeat(12 - Math.floor(hours / 2));
    return filled + empty;
};

module.exports.onLoad = ({ api }) => {
    setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hr12 = hours % 12 === 0 ? 12 : hours % 12;
        const minStr = minutes < 10 ? '0' + minutes : minutes;
        const currentTime = `${hr12}:${minStr} ${ampm}`;

        const msgObj = scheduleMsgs.find(item => item.timer === currentTime);
        if(msgObj) {
            const randomMsg = msgObj.message[Math.floor(Math.random() * msgObj.message.length)];
            const bar = getBar(hours);
            const styledMsg = `✨ ⏰ ${currentTime} ⏰ ✨\n${bar}\n${randomMsg}\n💬 Stay connected!`;
            global.data.allThreadID.forEach(threadID => api.sendMessage(styledMsg, threadID));
        }
    }, 60000); // Check every minute
};

module.exports.run = () => {};
