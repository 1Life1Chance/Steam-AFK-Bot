const SteamUser = require('steam-user');
const config = require('./config.json');
const client = new SteamUser();
const logOnOptions = {
    accountName: config.username,
    password: config.password,
};
const replyEnabled = false;
const repliededUsers = [];

client.logOn(logOnOptions);
client.on('loggedOn', () => {
    console.log('Succesfully logged on.');
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    client.gamesPlayed(config.idlegameid);
});

client.on("friendMessage", function (steamID, message) {
    if(message == config.enableCommand){
        console.log('Reply enabled');
        replyEnabled = true;
    } else if(message == config.disabledCommand) {
        console.log('Reply disabled');
        replyEnabled = false;
    } else if(replyEnabled && !repliededUsers.includes(steamID)){
        client.chatMessage(steamID, config.afkmessage);
        repliededUsers.push(steamID);
        setTimeout(() => {
            repliededUsers = repliededUsers.filter(function(steamIDs) { return steamIDs !== steamID })
        }, 10 * 60000); //10 min
    }
});