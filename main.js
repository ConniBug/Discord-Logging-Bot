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

const Discord = require("discord.js");
const client  = new Discord.Client({ fetchAllMembers: false })
const config = require("./config.json");

//
// DISCORD JS
//

var prefix = config.prefix;

// ready
/* Emitted when the client becomes ready to start working.    */
client.on("ready", function(){
	console.log(`I am ready! Logged in as ${client.user.tag}!`);    
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

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


// channelPinsUpdate
/* Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much information can be provided easily here - you need to manually check the pins yourself.
PARAMETER    TYPE         DESCRIPTION
channel      Channel      The channel that the pins update occurred in
time         Date         The time of the pins update    */
client.on("channelPinsUpdate", function(channel, time){
    console.log(`channelPinsUpdate: ${channel}:${time}`);
});
    
// channelUpdate
/* Emitted whenever a channel is updated - e.g. name change, topic change.
PARAMETER        TYPE        DESCRIPTION
oldChannel       Channel     The channel before the update
newChannel       Channel     The channel after the update    */
client.on("channelUpdate", function(oldChannel, newChannel){
    console.log(`channelUpdate -> a channel is updated - e.g. name change, topic change`);
});

// clientUserGuildSettingsUpdate
/* Emitted whenever the client user's settings update.
PARAMETER                  TYPE                       DESCRIPTION
clientUserGuildSettings    ClientUserGuildSettings    The new client user guild settings    */
client.on("clientUserGuildSettingsUpdate", function(clientUserGuildSettings){
    console.log(`clientUserGuildSettingsUpdate -> client user's settings update`);
});

// clientUserSettingsUpdate
/* Emitted when the client user's settings update.
PARAMETER             TYPE                  DESCRIPTION
clientUserSettings    ClientUserSettings    The new client user settings    */
client.on("clientUserSettingsUpdate", function(clientUserSettings){
    console.log(`clientUserSettingsUpdate -> client user's settings update`);
});

// debug
/* Emitted for general debugging information.
PARAMETER    TYPE         DESCRIPTION
info         string       The debug information    */
client.on("debug", function(info){
    console.log(`debug -> ${info}`);
});

// disconnect
/* Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
PARAMETER    TYPE              DESCRIPTION
Event        CloseEvent        The WebSocket close event    */
client.on("disconnect", function(event){
    console.log(`The WebSocket has closed and will no longer attempt to reconnect. Restarting Process.`);
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
    console.log(`a member is banned from a guild`);
});

client.on("guildBanRemove", function(guild, user){
    console.log(`a member is unbanned from a guild`);
});

client.on("guildCreate", function(guild){
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
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
});

// guildMemberAvailable
/* Emitted whenever a member becomes available in a large guild.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that became available    */
client.on("guildMemberAvailable", function(member){
    console.log(`member becomes available in a large guild: ${member.tag}`);
});

client.on("guildMemberRemove", function(member){
    console.log(`a member leaves a guild, or is kicked: ${member.tag}`);
});

// guildMembersChunk
/* Emitted whenever a chunk of guild members is received (all members come from the same guild).
PARAMETER      TYPE                      DESCRIPTION
members        Array<GuildMember>        The members in the chunk
guild          Guild                     The guild related to the member chunk    */
client.on("guildMembersChunk", function(members, guild){
    console.error(`a chunk of guild members is received`);
});

// guildMemberSpeaking
/* Emitted once a guild member starts/stops speaking.
PARAMETER     TYPE                DESCRIPTION
member        GuildMember         The member that started/stopped speaking
speaking      boolean             Whether or not the member is speaking    */
client.on("guildMemberSpeaking", function(member, speaking){
    console.log(`a guild member starts/stops speaking: ${member.tag}`);
});

client.on("guildMemberUpdate", function(oldMember, newMember){
    console.error(`a guild member changes - i.e. new role, removed role, nickname.`);
});

// guildUnavailable
/* Emitted whenever a guild becomes unavailable, likely due to a server outage.
PARAMETER    TYPE          DESCRIPTION
guild        Guild         The guild that has become unavailable    */
client.on("guildUnavailable", function(guild){
    console.error(`a guild becomes unavailable, likely due to a server outage: ${guild}`);
});

// guildUpdate
/* Emitted whenever a guild is updated - e.g. name change.
PARAMETER     TYPE      DESCRIPTION
oldGuild      Guild     The guild before the update
newGuild      Guild     The guild after the update    */
client.on("guildUpdate", function(oldGuild, newGuild){
    console.error(`a guild is updated`);
});

client.on("messageDelete", function(message){
    console.log(`message is deleted -> ${message}`);
});

// messageDeleteBulk
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

// typingStart
/* Emitted whenever a user starts typing in a channel.
PARAMETER      TYPE            DESCRIPTION
channel        Channel         The channel the user started typing in
user           User            The user that started typing    */
client.on("typingStart", function(channel, user){
    console.log(`${user.tag} has started typing in #${channel.name}`);
});

// typingStop
/* Emitted whenever a user stops typing in a channel.
PARAMETER       TYPE           DESCRIPTION
channel         Channel        The channel the user stopped typing in
user            User           The user that stopped typing    */
client.on("typingStop", function(channel, user){
    console.log(`${user.tag} has stopped typing in #${channel.name}`);
});

// userNoteUpdate
/* Emitted whenever a note is updated.
PARAMETER      TYPE          DESCRIPTION
user           User          The user the note belongs to
oldNote        String        The note content before the update
newNote        String        The note content after the update    */
client.on("userNoteUpdate", function(user, oldNote, newNote){
    console.log(`a member's note is updated`);
});

// userUpdate
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
