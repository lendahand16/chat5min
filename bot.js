const Discord = require("discord.js");
const Fs = require("fs");
const client = new Discord.Client();
//const PREFIX = "d$";
const ADD_CHANNEL = "d$+";
const REMOVE_CHANNEL = "d$-";
const MSG_ADDED = "```css\nAdded this channel to the Chat5Min list```";
const MSG_REMOVED = "```css\nRemoved Channel.```";
const MSG_ALREADYREMOVED = "```css\nChannel not on list.```";
//const MSG_CHANNELLIMIT = "```Sorry, you can only have one channel per guild.```";

let guildChannels = [];

client.on("ready", function () {
    console.log("Chat5Min Ready!");
    client.user.setPresence({"status":"online","game":{"name":"Delete Every 5 Minutes", "type":"LISTENING"}});
});

client.on("error", (err)=>{ console.log(err); });

client.on("warn",(info)=>{ console.log(info); });

client.on("message", function (msg) {
    if (msg.author.id !== client.user.id && (msg.channel.type === "text")) {
        if (msg.content === ADD_CHANNEL) {
            if (sendPermsReminder(msg)) return;
            let index = guildChannels.indexOf(msg.channel.id);
            if (index > -1) {
                //guildChannels.splice(index,1);
                msg.channel.send("Channel already added.");
            } else {
                guildChannels.push(msg.channel.id);
                deleteMsg(msg.channel).then(v=>{
                    msg.channel.send(MSG_ADDED);
                    msg.channel.send("```css\nThis is a #Chat5Min Channel. Messages will delete every 5 minutes.```");
                });
            }
        } else if (msg.content === REMOVE_CHANNEL) {
            if (sendPermsReminder(msg)) return;
            let index = guildChannels.indexOf(msg.channel.id);
            if (index > -1) {
                guildChannels.splice(index,1);
                msg.channel.send(MSG_REMOVED);
            } else {
                msg.channel.send(MSG_ALREADYREMOVED);
            }
        }
    }
});

function sendPermsReminder(msg=Discord.Message.prototype) {
    if (!msg.channel.permissionsFor(client.user).has(75776)) {
        msg.author.send("```css\n[Missing required permissions] on \""+msg.guild.name+"\" #"+msg.channel.name+"```");
        return true;
    }
    return false;
}

async function deleteMsg(channel=Discord.TextChannel.prototype) {
    return new Promise(async(resolve)=>{
        let currentMessages = await channel.fetchMessages();
        while (currentMessages.array().length > 0) {
            await channel.bulkDelete(currentMessages);
            currentMessages = await channel.fetchMessages();
        }
        resolve();
    });
}

async function deleteChat() {
    //console.log("HIII");
    let currentMinutes = new Date().getMinutes();
    if ((currentMinutes + 1) % 2 === 0) {
        //console.log("TIK");
        for (let chann of guildChannels) {
            let currentChannel = client.channels.get(chann);
            currentChannel.send("```Deleting in 1 minute.```");
        }
    } else if ((currentMinutes) % 2 === 0) {
        //console.log("DEL");
        for (let chann of guildChannels) {
            deleteMsg(client.channels.get(chann)).then(v=>{
                channel.send("```css\n#Chat5Min Channel. Messages will delete every 5 minutes.```");
            });
        }
    }
}

if (Fs.existsSync("./token.txt")) {
    client.login(Fs.readFileSync("./token.txt").toString());
} else {
    client.login(process.env.BOT_TOKEN);
}
setInterval(deleteChat,1000*60);
