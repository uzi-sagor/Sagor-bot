module.exports.config = {
    name: "help",
    version: "9.0.0",
    permission: 0,
    credits: "Sagor",
    description: "Stylish command list + command info (excluding system)",
    prefix: true,
    premium: false,
    category: "system",
    usages: "[command]",
    cooldowns: 3
};

module.exports.run = function ({ event, args, api }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    if (!args[0]) {
        let categories = {};
        commands.forEach(cmd => {
            if (cmd.config.category.toLowerCase() === "system") return;
            if (!categories[cmd.config.category]) categories[cmd.config.category] = [];
            categories[cmd.config.category].push(cmd);
        });

        let msg = "✨📌 BOT COMMAND LIST 📌✨\n\n";
        for (let category in categories) {
            msg += `💠 ${category.toUpperCase()} 💠\n\n`;
            categories[category].forEach(cmd => {
                msg += `• ${cmd.config.name.toUpperCase()} | 👑 ${cmd.config.permission}\n`;
            });
            msg += `\n────────────────────────────\n\n`;
        }

        return api.sendMessage(msg, threadID, messageID);
    } else {
        const name = args[0].toLowerCase();
        const command = commands.get(name);
        if (!command) return api.sendMessage(`❌ Command "${name}" not found!`, threadID, messageID);
        if (command.config.category.toLowerCase() === "system") return api.sendMessage(`❌ This is a system command!`, threadID, messageID);

        const info = command.config;
        let msg = "🌟🌟🌟 COMMAND INFO 🌟🌟🌟\n\n";
        msg += `📝 Command Name : ${info.name.toUpperCase()}\n`;
        msg += `👑 Permission  : ${info.permission}\n`;
        msg += `📂 Category    : ${info.category.toUpperCase()}\n`;
        msg += `⏱ Cooldown    : ${info.cooldowns || 0} seconds\n`;
        msg += `💳 Credits     : ${info.credits}\n`;
        msg += `📦 Dependencies: ${(Object.keys(info.dependencies || {}).join(", ") || "None")}\n`;
        msg += "\n────────────────────────────\n";

        return api.sendMessage(msg, threadID, messageID);
    }
};
