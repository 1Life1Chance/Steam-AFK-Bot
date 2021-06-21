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
    client.setPersona(SteamUser.EPersonaState.Online);
});

client.on('error', e => {
    switch (e.eresult) {
        case SteamUser.EResult.AccountDisabled:
            console.log(`This account is disabled!`);
            break;
        case SteamUser.EResult.InvalidPassword:
            console.log(`Invalid Password detected!`);
            break;
        case SteamUser.EResult.RateLimitExceeded:
            console.log(`Rate Limit Exceeded.`);
            break;
        case SteamUser.EResult.LogonSessionReplaced:
            console.log(`Unexpected Disconnection!, you have LoggedIn with this same account in another place..`);
            break;
        default:
            console.log("Unexpected Disconnection!");
            break;
    }
});

client.on("friendMessage", function (steamID, message) {
    if(message == '!yourcommamd'){
        client.chatMessage(steamID, 'your reply');
    } else if(message == '!yourcommamd2'){
        client.chatMessage(steamID, 'your reply2');
    } else {
        client.chatMessage(steamID, config.afkmessage);
        repliededUsers.push(steamID);
        setTimeout(() => {
            repliededUsers = repliededUsers.filter(function(steamIDs) { return steamIDs !== steamID })
        }, 10 * 60000); //10 min
    }
});