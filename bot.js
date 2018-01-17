var Discord = require('discord.io');

var logger = require('winston');
var auth = require('./auth.json');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);

        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({ to: channelID, message: 'Pong!' });
            break;
            case 'rentDays':
                if (args.length !== 1 && (args[0] !== '' && !isNan(args[0]))) {
                    bot.sendMessage({ to: channelID, message: 'Wrong syntax, should be !rentDays <int>'});
                }
                else {
                    str = 'Reminding you to pay rent in ';
                    bot.sendMessage({ to: channelID, message: str.concat(args[0], ' day(s).') });
                    setTimeout(function(){ payRent(bot, userID, channelID);}, parseInt(args[1])*10000);
                }
            break;
            default:
                bot.sendMessage({ to: channelID, message: 'Unknown command.' });
        }
    }
})

function payRent(bot, user, channelID){
    var alert = "<@" + user + "> PAY YOUR RENT";
    bot.sendMessage({ to: channelID, message: alert });
    bot.sendMessage({ to: channelID, message: alert });
}
