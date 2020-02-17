var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
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

function findPlaces(args) {
  var stringToFind = args[0];
  var world = require('../data.json');
  var results = [];
  for (var i = 0; i < world.states.length; i++) {
    if (world.states[i].name == stringToFind) {
      results.push("https://codemaker4.github.io/NRCBmap/?script=setCamToThing(%27states%27," + world.states[i].id.toString() + ")");
    }
  }
  for (var i = 0; i < world.provinces.length; i++) {
    if (world.provinces[i].name == stringToFind) {
      results.push("https://codemaker4.github.io/NRCBmap/?script=setCamToThing(%27provinces%27," + world.provinces[i].id.toString() + ")");
    }
  }
  return results;
}

function findNations(args) {
  var stringToFind = args[0];
  var world = require('../data.json');
  var results = [];
  var allowedAutomaticValues = ["description", "discord tag"];
  for (var i = 0; i < world.nations.length; i++) {
    if (world.nations[i].name == stringToFind) {
      var resString = "nation " + world.nations[i].name + ":\n"
      for (const [key, value] of Object.entries(world.nations[i])) {
        if (allowedAutomaticValues.includes(key)) {
          resString = resString + " - " + key.toString() + " : " + value.toString() + "\n";
        }
      }
      resString = resString + " - colonies:\n"
      for (var i = 0; i < world.nations[i].colonies.length; i++) {
        resString = resString + "    - " + world.nations[i].colonies[i].name + "\n";
      }
      results.push(resString)
    }
  }
  return results;
}

function sendSearchResult(results, channelID) {
  if (results.length == 0) {
    bot.sendMessage({
        to: channelID,
        message: "Found 0 results."
    });
  } else if (results.length > 0) {
    var reply = "Found " + results.length.toString() + " results:\n";
    for (var i = 0; i < results.length; i++) {
      reply += results[i] + "\n";
    }
    bot.sendMessage({
        to: channelID,
        message: reply
    });
  }
}

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        console.log("evaluating", message, user);

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'pong'
                });
                console.log('cmd ping', user, message);
            break;
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'Here is some _help&stuff_:\n'
                            +'`!ping` Use this command to check if the bot is online. The bot should reply `pong` (nearly) instantly. If the bot doesn\'t reply or if it takes like a couple of seconds consistantly, please notify me (@ codemaker_4)\n'
                            +'`!find <text to search>` Use this command to let the bot find provinces/states on the map. It will send you a nifty link that shows the thing it found on the map.\n'
                            +'`!nation <nation name>` Use this command to get info about the nations.\n'
                            +'If you notice that something is wrong, please notify me (@ codemaker_4).'
                });
            break;
            case 'hi':
                bot.sendMessage({
                    to: channelID,
                    message: 'Hello ' + user
                });
            break;
            case 'find':
                var stringToFind = args[0];
                if (args.length !== 1) {
                  bot.sendMessage({
                      to: channelID,
                      message: 'error: `!find` needs 1 argument: `!find <name of thing to find>`'
                  });
                  break;
                }
                var world = require('../data.json');
                var results = findPlaces(args);
                sendSearchResult(results, channelID);
            break;
            case 'nation':
                var stringToFind = args[0];
                if (args.length !== 1) {
                  bot.sendMessage({
                      to: channelID,
                      message: 'error: `!nation` needs 1 argument: `!find <nation name>`'
                  });
                  break;
                }
                var world = require('../data.json');
                var results = findNations(args);
                sendSearchResult(results, channelID);
            break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'error: `!' + cmd + '` is not a command. Try `!help`'
                });
            // Just add any case commands if you want to..
         }
     }
});
