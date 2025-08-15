module.exports = function({ api, models, Users, Threads, Currencies }) {
    const stringSimilarity = require('string-similarity'),
      escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      logger = require("../../utility/logs.js");
    const axios = require('axios')
    const moment = require("moment-timezone");
    return async function({ event }) {
      const dateNow = Date.now()
      const time = moment.tz("Asia/Manila").format("HH:MM:ss DD/MM/YYYY");
    
      const { allowinbox, adminonly, developermode, operators, approval, approvedgroups, disabledcmds, disabledevnts } = global.config;
      
      const userId = await api.getCurrentUserID();
      var prefix = global.config.PREFIX;
      var admins = global.config.ADMINS;
      var botname = global.config.BOTNAME;
      
      const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
      const { commands, cooldowns } = global.client;
      var { body, senderID, threadID, messageID } = event;
      var senderID = String(senderID),
        threadID = String(threadID);
      const threadSetting = threadData.get(threadID) || {}
      const args = (body || '').trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();
      var command = commands.get(commandName);
      const send = global.send;
      const replyAD = 'mode - only bot admin can use bot';
      const notApproved = `this box is not approved.\nuse "${prefix}request" to send a approval request from bot operators`;
      
      const approvedGroups = approvedgroups || [];
      const botOperators = operators || [];
      const botAdmins = admins || [];
      
      if (typeof body === "string" && body.startsWith(`${prefix}request`) && approval) {
        if (approvedGroups.includes(threadID)) {
          return api.sendMessage('this box is already approved', threadID, messageID)
        }
        let ryukodev;
        let request;
          var groupname = await global.data.threadInfo.get(threadID).threadName || "name does not exist";
          ryukodev = `group name : ${groupname}\ngroup id : ${threadID}`;
          request = `${groupname} group is requesting for approval`
        try {
          botOperators.forEach(i => {
              api.sendMessage(request + '\n\n' + ryukodev, i);
          })
          api.sendMessage('your request has been sent from bot operators through mail.', threadID, messageID);
        } catch (error) {
          logger(error, "error");
        }
        
      }
      if (command && (command.config.name.toLowerCase() === commandName.toLowerCase()) &&(!approvedGroups.includes(threadID) && !botOperators.includes(senderID) && !botAdmins.includes(senderID) && approval)) {
        return api.sendMessage(notApproved, threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            });
      }
      if (typeof body === 'string' && body.startsWith(prefix) && (!approvedGroups.includes(threadID) && !botOperators.includes(senderID) && !botAdmins.includes(senderID) && approval)) {
        return api.sendMessage(notApproved, threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            });
      }
      if (command && (command.config.name.toLowerCase() === commandName.toLowerCase()) && (!botAdmins.includes(senderID) && !botOperators.includes(senderID) && adminonly && senderID !== api.getCurrentUserID())) {
        return api.sendMessage(replyAD, threadID, messageID);
      }
      if (typeof body === 'string' && body.startsWith(prefix) && (!botOperators.includes(senderID) && adminonly && senderID !== api.getCurrentUserID())) {
        return api.sendMessage(replyAD, threadID, messageID);
      }
  
  
      if (userBanned.has(senderID) || threadBanned.has(threadID) || allowinbox == ![] && senderID == threadID) {
        if (!botAdmins.includes(senderID.toString()) && !botOperators.includes(senderID.toString()))
        {
          if (command && (command.config.name.toLowerCase() === commandName.toLowerCase()) && userBanned.has(senderID)) {
            const { reason, dateAdded } = userBanned.get(senderID) || {};
            return api.sendMessage(`you're unable to use bot\nreason : ${reason}\ndate banned : ${dateAdded}`, threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          } else {
            if (command && (command.config.name.toLowerCase() === commandName.toLowerCase()) && threadBanned.has(threadID)) {
              const { reason, dateAdded } = threadBanned.get(threadID) || {};
              return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
                await new Promise(resolve => setTimeout(resolve, 5 * 1000));
                return api.unsendMessage(info.messageID);
              }, messageID);
            }
          } 
          if (typeof body === 'string' && body.startsWith(prefix) && userBanned.has(senderID)) {
            const { reason, dateAdded } = userBanned.get(senderID) || {};
            return api.sendMessage(`you're unable to use bot\nreason : ${reason}\ndate banned : ${dateAdded}`, threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          } else {
            if (typeof body === 'string' && body.startsWith(prefix) && threadBanned.has(threadID)) {
              const { reason, dateAdded } = threadBanned.get(threadID) || {};
              return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
                await new Promise(resolve => setTimeout(resolve, 5 * 1000));
                return api.unsendMessage(info.messageID);
              }, messageID);
            }
          }
  
        }
      }
  
      if (commandName.startsWith(prefix)) {
        if (!command) {
          const allCommandName = Array.from(commands.keys());
          const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
          if (checker.bestMatch.rating >= 0.5) {
            command = commands.get(checker.bestMatch.target);
          } else {
            return api.sendMessage(global.getText("handleCommand", "commandNotExist", checker.bestMatch.target), threadID, messageID);
          }
        }
      }
      if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
        if (!botAdmins.includes(senderID) && !botOperators.includes(senderID)) {
          const banThreads = commandBanned.get(threadID) || [],
            banUsers = commandBanned.get(senderID) || [];
          if (banThreads.includes(command.config.name))
            return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000))
              return api.unsendMessage(info.messageID);
            }, messageID);
          if (banUsers.includes(command.config.name))
            return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
        }
      }
  
      const hasPremiumCmd = global.config.haspremiumcmd || [];
      const premium = global.config.premium;
      if (premium) {
        if (command && command.config) {
          if (command.config.premium && !hasPremiumCmd.includes(senderID)) {
            return api.sendMessage(`the command you used is only for premium users. If you want to use it, you can contact the admins and operators of the bot or you can type ${prefix}requestpremium.`, event.threadID, async (err, eventt) => {
              if (err) {
                return;
              }
                await new Promise(resolve => setTimeout(resolve, 5 * 1000))
                return api.unsendMessage(eventt.messageID);
            }, event.messageID);
          }
        }
      }
  
      if (command && command.config) {
        if (command.config.prefix === false && commandName.toLowerCase() !== command.config.name.toLowerCase()) {
          api.sendMessage(global.getText("handleCommand", "notMatched", command.config.name), event.threadID, event.messageID);
          return;
        }
        if (command.config.prefix === true && !body.startsWith(prefix)) {
          return;
        }
      }
      if (command && command.config) {
        if (typeof command.config.prefix === 'undefined') {
          api.sendMessage(global.getText("handleCommand", "noPrefix", command.config.name), event.threadID, event.messageID);
          return;
        }
      }
  
      const threadAllowNSFW = global.data.threadAllowNSFW || [];
      if (command && command.config && command.config.category && command.config.category.toLowerCase() === 'nsfw' && !threadAllowNSFW.includes(threadID) && !botAdmins.includes(senderID))
        return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), threadID, async (err, info) => {
          await new Promise(resolve => setTimeout(resolve, 5 * 1000))
          return api.unsendMessage(info.messageID);
        }, messageID);
      var threadInfo2;
      if (event.isGroup == !![])
        try {
          threadInfo2 = (threadInfo.get(threadID) || await Threads.getInfo(threadID))
          if (Object.keys(threadInfo2).length == 0) throw new Error();
        } catch (err) {
          logger(global.getText("handleCommand", "cantGetInfoThread", "error"));
        }
      var permssion = 0;
      var threadInfoo = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
      const Find = threadInfoo.adminIDs.find(el => el.id == senderID);
      const ryuko = '!botOperators.includes(senderID)';
      
      if (botOperators.includes(senderID.toString())) permssion = 3;
      else if (botAdmins.includes(senderID.toString())) permssion = 2;
      else if (!botAdmins.includes(senderID) && ryuko && Find) permssion = 1;

      if (command && command.config && command.config.permission && command.config.permission > permssion) {
        return api.sendMessage(global.getText("handleCommand", "permissionNotEnough", command.config.name), event.threadID, event.messageID);
      }
  
      if (command && command.config && !client.cooldowns.has(command.config.name)) {
        client.cooldowns.set(command.config.name, new Map());
      }
  
      const timestamps = command && command.config ? client.cooldowns.get(command.config.name) : undefined;
  
      const expirationTime = (command && command.config && command.config.cooldowns || 1) * 1000;
  
      if (timestamps && timestamps instanceof Map && timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime)
  
        return api.setMessageReaction('🕚', event.messageID, err => (err) ? logger('An error occurred while executing setMessageReaction' + 2, "error") : '', !![]);
      var getText2;
      if (command && command.languages && typeof command.languages === 'object' && command.languages.hasOwnProperty(global.config.language))
  
        getText2 = (...values) => {
          var lang = command.languages[global.config.language][values[0]] || '';
          for (var i = values.length; i > 0x2533 + 0x1105 + -0x3638; i--) {
            const expReg = RegExp('%' + i, 'g');
            lang = lang.replace(expReg, values[i]);
          }
          return lang;
        };
      else getText2 = () => { };
      
      try {
        const Obj = {
          api: api,
          event: event,
          args: args,
          models: models,
          Users: Users,
          prefix: prefix,
          botname: botname,
          admin: botAdmins,
          Threads: Threads,
          Currencies: Currencies,
          permssion: permssion,
          getText: getText2,
          botid: userId
        };
  
        if (command && typeof command.run === 'function') {
          command.run(Obj);
          timestamps.set(senderID, dateNow);
  
          if (developermode == !![]) {
            logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow) + '\n', "cmd");
          }
  
          return;
        }
      } catch (e) {
        return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
      }
    };
  };
