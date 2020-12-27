function getConfig(guildID) {
    var conf = ["",""];
    configs.forEach(config => {
        console.log(config[0] + ` - ` + guildID);
        if(config[0] === guildID) {
            conf = config;
        }
    })
    return conf;
}

function postInteractionInfomation(guildID) {
    console.log(`Posted: ${guildID}`);

    client.api.applications(client.user.id).guilds(guildID).commands.post({
        data: {
            name: "info",
            description: "Display bot infomation!"
            // possible options here e.g. options: [{...}]
        }
    });
}

function messageGuildOwner(guild, message) {
    guild.members.cache.find(c => c.id == guild.owner.user.id).send(message);
}

var ownersDiscordTag = "Conni!~#0920";
var versionNum = "V0.0.1.1b";

const fs = require('fs');
const moment = require('moment');
const Discord = require("discord.js");
const client  = new Discord.Client({ fetchAllMembers: false })
const config = require("./config.json");
var prefix = config.prefix;
const path = require('path');

var configs = 
[
    [
        guildID = "689925894764232788",
        mesageDeleteChannel = "792472649107243048",
        userJoined = "792483665669390366"
    ]
];

var last100Events = [["null", "null"]];

var http = require('http');
var http = require('http');
const url = require('url');

//create a server object:
http.createServer(function (req, res) {
    const queryObject = url.parse(req.url,true);
    var pathname = queryObject.pathname;
    var query    = queryObject.query;

    var content = "<meta http-equiv='refresh' content='6'>";
    if(pathname === "/dash") {
        
    }

    if(pathname === "/api/0/getEvents") {
        if(query.serverID) {
            console.log(query.serverID);
            last100Events.forEach(event => {
                
                if(event[1].includes(`] - [${query.serverID}] - [`)) {
                    content += "<br>" + event[1];
                }
                else {
                    console.log("--------");
                    console.log(event[1]);
                    console.log("Does not include");
                }
            })
        }
    }
    if(pathname === "/api/0/getAllEvents") {
        var i = last100Events.length - 10;
        if(i < 1) i = 1;

        for(var t = i; t <= last100Events.length; t++) {
            //console.log(last100Events[t]);
            var str = last100Events[t];

            if(str != undefined) {
                content += "<br>" + str.toString().split(",")[1];

            }
            
            //console.log(last100Events[t]);
            
            var str = last100Events[t];

            if(str != undefined) {
                str = str.toString();

                var username = str.toString().split(",")[1].split(" - > ")[0];
                var server = str.toString().split(",")[1].split(" - > ")[1];
                var channel = str.toString().split(",")[1].split(" - > ")[2];

                content += "<br>" + username + server + channel;
            
            }
        }
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`${content} <script>
    function httpGet(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }
        
      </script>
      `); //write a response to the client
    res.end(); //end the response
}).listen(8080); //the server object listens on port 8080 
/* 
CONFIG

1 = deleted Message
2 = User Joined


*/

function log(action, guildID, content) {
    var built = `[${action}] - [${guildID}] - [${Date.now()}] - ${content}`;
    console.log(built);
    last100Events.push([guildID, built]);
}

var booted = false;
// ready
/* Emitted when the client becomes ready to start working.    */
client.on("ready", function(){

    let rawdata = fs.readFileSync('last100Events.json');
    last100Events = JSON.parse(rawdata);
    console.log(last100Events);

    booted = true;

    log("BOOT", "SYS", `I am ready! Logged in as ${client.user.tag}!`);
    log("BOOT", "SYS", `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    const Guilds = client.guilds.cache.map(guild => guild.id);
    console.log(Guilds);

    Guilds.forEach(e => {
        postInteractionInfomation(e);
    });

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if (command === 'info'){
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `${ownersDiscordTag} - Version: ${versionNum}`
                    }
                }
            })
        }
    });
});
client.on("channelCreate", function(channel){
    console.log(`channelCreate: ${channel}`);
});
client.on("channelDelete", function(channel){
    console.log(`channelDelete: ${channel}`);
});
client.on("channelPinsUpdate", function(channel, time){
    console.log(`channelPinsUpdate: ${channel}:${time}`);
});
client.on("channelUpdate", function(oldChannel, newChannel){
    console.log(`channelUpdate -> a channel is updated - e.g. name change, topic change`);
});
client.on("clientUserGuildSettingsUpdate", function(clientUserGuildSettings){
    console.log(`clientUserGuildSettingsUpdate -> client user's settings update`);
});
client.on("clientUserSettingsUpdate", function(clientUserSettings){
    console.log(`clientUserSettingsUpdate -> client user's settings update`);
});
client.on("disconnect", function(event){
    console.log(`The WebSocket has closed and will no longer attempt to reconnect. Restarting Process.`);
    last100Events.push(["NULL", "WebSocket has clossed and will no longer attempt to reconect. Restarting Process."]);

    process.exit(1);
});
client.on("emojiCreate", function(emoji){
    console.log(`a custom emoji is created in a guild`);
});
client.on("emojiDelete", function(emoji){
    console.log(`a custom guild emoji is deleted`);
});
client.on("emojiUpdate", function(oldEmoji, newEmoji){
    console.log(`a custom guild emoji is updated`);
});
client.on("error", function(error){
    console.error(`client's WebSocket encountered a connection error: ${error}`);
});
client.on("guildBanAdd", function(guild, user){
    var logMessage = `User: [${user.tag}] has been banned from the guild: [${guild.name}]`;
    console.log(logMessage);
    last100Events.push([guild.id, logMessage]);

});
client.on("guildBanRemove", function(guild, user){
    var logMessage = `User: [${user.tag}] has been unbanned from the guild: [${guild.name}]`;
    console.log(logMessage);
    last100Events = last100Events + [guild.id, logMessage];

});
client.on("guildCreate", function(guild){
    var logMessage = `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`;
    console.log(logMessage);
    last100Events.push([guild.id, logMessage]);

    client.user.setActivity(`${client.guilds.cache.size} Servers!`);

    postInteractionInfomation(guild.id);
});
client.on("guildDelete", function(guild){
    console.log(`the client deleted/left a guild`);
    console.log(`Guild left: ${guild.name} (id: ${guild.id}). The guild had ${guild.memberCount} members!`);
    client.user.setActivity(`${client.guilds.cache.size} Servers!`);

});
client.on("guildMemberAdd", function(guildMember){
    console.log(`a user joins a guild: ${guildMember.tag}`);

    var guildID = message.guild.id;

    // GET CONFIG
    var conf = ["",""];
    conf = getConfig(guildID);
    ////////////////////////////////////////////////
    let channel = message.guild.channels.cache.find(c => c.id == conf[2]);


    var authorTAG = guildMember.tag || "NULL";
    var authorID = guildMember.ID || "NULL";
    var avatarURL = message.author.avatarURL() || "";
    // inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
	.setTimestamp()
	.setColor(`red`)
	.setAuthor(authorTAG, avatarURL, '')
	.setDescription(`<@${authorID}> Joined!`)
	.addField('UserName', `<@${authorID}> ${authorTAG} - ${authorID}`, false)
    .addField('Joined at:', `${moment.utc(guildMember.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
    .addField('Status:', guildMember.presence.status, true)    
    .addField('ID', "```" + `User: ${authorID}\n: ${authorID}` + "```", true);

    channel.send(exampleEmbed);
});
client.on("guildMemberAvailable", function(member){
    console.log(`member becomes available in a large guild: ${member.tag}`);
});

client.on("guildMemberRemove", function(member){
    console.log(`a member leaves a guild, or is kicked: ${member.tag}`);
});
/* Emitted whenever a chunk of guild members is received (all members come from the same guild).
PARAMETER      TYPE                      DESCRIPTION
members        Array<GuildMember>        The members in the chunk
guild          Guild                     The guild related to the member chunk    */
client.on("guildMembersChunk", function(members, guild){
    console.error(`a chunk of guild members is received`);
});
client.on("guildMemberSpeaking", function(member, speaking){
    console.log(`a guild member starts/stops speaking: ${member.tag}`);
});
client.on("guildMemberUpdate", function(oldMember, newMember){
    console.error(`a guild member changes - i.e. new role, removed role, nickname.`);
});
client.on("guildUnavailable", function(guild){
    console.error(`a guild becomes unavailable, likely due to a server outage: ${guild}`);
});
client.on("guildUpdate", function(oldGuild, newGuild){
    console.error(`a guild is updated`);
});
client.on("message", async function(message){
    if(message.author.bot) return;
    log("message", message.guild.id, `${message.author.tag} - > ${message.guild.name} - > #${message.channel.name} - > ${message.content}`);

    if(message.content === "r") {

        let voiceChannel = message.member.voice.channel;

        message.delete();

        var user = message.author;
        
        joinVoiceChannel(voiceChannel);
    }
});
client.on("messageDelete", function(message){    
    var guildID = message.guild.id;

    // GET CONFIG
    var conf = ["",""];
    conf = getConfig(guildID);
    ////////////////////////////////////////////////


    let channel = message.guild.channels.cache.find(c => c.id == conf[1]);
    console.log(conf[1]);

    var messageContent = message.content || "NULL";
    if(messageContent === "NULL") {
        return;
    }
    var guildName = message.guild.name || "NULL";
    var authorTAG = message.author.tag || "NULL";
    var authorID = message.author.id || "NULL";
    var avatarURL = message.author.avatarURL() || "";
    var channelID = message.channel.id || "NULL";
    var channelName = message.channel.name || "NULL";

    const exampleEmbed = new Discord.MessageEmbed()
	.setTimestamp()
	.setColor(`red`)
	.setAuthor(authorTAG, avatarURL, '')
	.setDescription(`Message deleted in #${channelName}`)
	.addField('Content', messageContent, false)
	.addField('ID', "```" + `User: ${authorID}\nChannel: ${channelID}` + "```", true);

    log("messageDeleted", message.guild.id, `${authorTAG} - > ${guildName} - > #${channelName} - > ${messageContent}`);

    channel.send(exampleEmbed);
});
/* Emitted whenever messages are deleted in bulk.
PARAMETER    TYPE                              DESCRIPTION
messages     Collection<Snowflake, Message>    The deleted messages, mapped by their ID    */
client.on("messageDeleteBulk", function(messages){
    console.log(`messages are deleted -> ${messages}`);
});
client.on("messageReactionAdd", function(messageReaction, user){
    console.log(`a reaction is added to a message`);
});
client.on("messageReactionRemove", function(messageReaction, user){
    console.log(`a reaction is removed from a message`);
});
client.on("messageReactionRemoveAll", function(message){
    console.error(`all reactions are removed from a message`);
});
client.on("messageUpdate", function(oldMessage, newMessage){
    console.log(`a message is updated`);
});
client.on("presenceUpdate", function(oldMember, newMember){
    console.log(`a guild member's presence changes`);
});
client.on("reconnecting", function(){
    console.log(`client tries to reconnect to the WebSocket`);
});
client.on("resume", function(replayed){
    console.log(`whenever a WebSocket resumes, ${replayed} replays`);
});
client.on("roleCreate", function(role){
    console.error(`a role is created`);
});
client.on("roleDelete", function(role){
    console.error(`a guild role is deleted`);
});
client.on("roleUpdate", function(oldRole, newRole){
    console.error(`a guild role is updated`);
});
/* Emitted whenever a user starts typing in a channel.
PARAMETER      TYPE            DESCRIPTION
channel        Channel         The channel the user started typing in
user           User            The user that started typing    */
client.on("typingStart", function(channel, user){
    console.log(`${user.tag} has started typing in #${channel.name}`);
});
/* Emitted whenever a user stops typing in a channel.
PARAMETER       TYPE           DESCRIPTION
channel         Channel        The channel the user stopped typing in
user            User           The user that stopped typing    */
client.on("typingStop", function(channel, user){
    console.log(`${user.tag} has stopped typing in #${channel.name}`);
});
/* Emitted whenever a note is updated.
PARAMETER      TYPE          DESCRIPTION
user           User          The user the note belongs to
oldNote        String        The note content before the update
newNote        String        The note content after the update    */
client.on("userNoteUpdate", function(user, oldNote, newNote){
    console.log(`a member's note is updated`);
});
/* Emitted whenever a user's details (e.g. username) are changed.
PARAMETER      TYPE        DESCRIPTION
oldUser        User        The user before the update
newUser        User        The user after the update    */
client.on("userUpdate", function(oldUser, newUser){
    console.log(`user's details (e.g. username) are changed`);
});
client.on("voiceStateUpdate", function(oldMember, newMember){
    console.log(`a user changes voice state`);
});
client.on("warn", function(info){
    console.log(`warn: ${info}`);
});
client.login(config.token);
