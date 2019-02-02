//
// (C) 2019 Oliver -- Lendahand16
// Chat5Min Discord Chat Purge Bot
//

const Discord = require("discord.js");
const Fs = require("fs");
const client = new Discord.Client();

function helpHandler(msg=Discord.Message.prototype) {
    msg.author.send("This bot deletes messages every 5 minutes.\n\nSteps to using the Chat5Min bot.\n`[1]` Create a text channel called **`chat5min`**.\n`[2]` Give the following permissions to the Chat5Min bot in that channel:\n`Read Messages`,   `Send Messages`,   `Manage Messages`,   `Read Message History`.");
}

function inputHandler(msg=Discord.Message.prototype) {
    // check to see if message is from bot and is also in a guild (not a direct message).
    if (!(msg.author.id !== client.user.id && (msg.channel.type === "text"))) return;
    switch (msg.content) {
        case "d$?":
        case "d$help":
            helpHandler(msg);
        break;
        default:
        break;
    }
}

function deleteMessages(channel=Discord.TextChannel.prototype) {
    return new Promise(async(resolve)=>{
        let currentMessages = await channel.fetchMessages();
        while (currentMessages.array().length > 0) {
            await channel.bulkDelete(currentMessages);
            currentMessages = await channel.fetchMessages();
        }
        resolve();
    });
}

function purgeChannels() {
    let currentMinutes = new Date().getMinutes();
    for (let guild of client.guilds) {
        const currentChannel = guild[1].channels.find(channel => channel.name === "chat5min");
        if (currentChannel.permissionsFor(client.user).has(75776)) {
            // Warning Message
            if ((currentMinutes + 1) % 5 === 0)  {
                currentChannel.send("Deleting all messages in 1 minute.");
            // Delete Messages
            } else if ((currentMinutes) % 5 === 0) {
                deleteMessages(currentChannel).then(v=>{
                    currentChannel.send("```css\n#Chat5Min Channel. Messages will delete every 5 minutes.```");
                });
            }
        } else if (currentChannel.permissionsFor(client.user).has(2048)) {
            currentChannel.send("Hey there, I need some help to work properly...\nHere's how to use the Chat5Min bot.\n`[1]` Create a text channel called **`chat5min`**.\n`[2]` Give the following permissions to the Chat5Min bot in that channel:\n`Read Messages`,   `Send Messages`,   `Manage Messages`,   `Read Message History`.");
        }
    }
}

// Main Program

client.on("ready",initBot);
client.on("error",console.log);
client.on("message", inputHandler);

if (Fs.existsSync("./token.txt")) client.login(Fs.readFileSync("./token.txt").toString());
else client.login(process.env.BOT_TOKEN);

function initBot() {
    console.log("Chat5Min Ready!");
    setInterval(purgeChannels,1000*60);
    client.user.setPresence({"status":"online","game":{"name":"d$?", "type":"LISTENING"}});
    purgeChannels();
}
