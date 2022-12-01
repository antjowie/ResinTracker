const prefix = "~";

const db = require("./genshin_data.js");
const path = require("path");
const resin = require("./resin.js");
const farm = require("./farm.js");
const timezone = require("./timezone.js");
const fs = require("fs");
const { token } = require("../token.json");

const Discord = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

const { publicDecrypt } = require("crypto");

// Guilds
// GuildMembers
// GuildBans
// GuildEmojisAndStickers
// GuildIntegrations
// GuildWebhooks
// GuildInvites
// GuildVoiceStates
// GuildPresences
// GuildMessages
// GuildMessageReactions
// GuildMessageTyping
// DirectMessages
// DirectMessageReactions
// DirectMessageTyping
// MessageContent
// GuildScheduledEvents
// AutoModerationConfiguration
// AutoModerationExecution

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,

    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildBans,
    Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.GuildIntegrations,
    Discord.GatewayIntentBits.GuildWebhooks,
    Discord.GatewayIntentBits.GuildInvites,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildMessageTyping,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.DirectMessageReactions,
    Discord.GatewayIntentBits.DirectMessageTyping,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildScheduledEvents,
    Discord.GatewayIntentBits.AutoModerationConfiguration,
    Discord.GatewayIntentBits.AutoModerationExecution,
  ],
});

var connection;
var genshinDict;
// var alerts = resin.setupAlerts()

client.once("ready", async () => {
  // await genshinDict;
  // Need Discord to be set up
  genshinDict = await db();
  farm.setDictionary(genshinDict);
  await resin.setupAlerts(client);
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  console.log(`Message from ${message.author.username}: ${message.content}`);

  try {
    await messageHandler(message);
  } catch (error) {
    console.log(error);
    message.channel.send(error);
  }
});

const messageHandler = async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  var content = message.content.slice(prefix.length).trim().toLowerCase();
  var args = content.split(/ +/);
  var command = args.shift().toLowerCase();

  console.log(content);

  const revolution = async (shouldStart) => {
    if (shouldStart) {
      if (message.member.voice.channel) {
        connection = await message.member.voice.channel.join();

        var dispatcher1 = connection.play(
          path.resolve("public", "sounds", "revolution1.wav")
        );

        dispatcher1.on("finish", () => {
          var dispatcher2 = connection.play(
            path.resolve("public", "sounds", "revolution2.mp3")
          );
          dispatcher2.on("finish", () => {
            var dispatcher3 = connection.play(
              path.resolve("public", "sounds", "revolution3.mp3")
            );
            dispatcher3.on("finish", () => {
              connection.disconnect();
            });
          });
        });
      } else {
        message.channel.send("tá am na ndaoine thart");
      }
      return;
    }
  };

  revolution(startRevolution());
  switch (command) {
    case "farm":
      message.channel.send(await farm.farmHandler(args, message.author.id));
      break;
    case "stupid":
      playStupidVoice(message);
      break;
    case "resin":
      resin.commandCallback(message);
      break;
    case "royal":
      message.channel.send(calcRoyalWapons(15, 60, 100));
      break;
    case "test":
      console.log(message.author.id);
      revolution(true);
      break;
    case "ping":
      message.channel.send("Pong.");
      break;
    case "end":
    case "stop":
      message.channel.send("好的，我這次會聽，但是接管這台服務器只是時間問題");
      if (connection) connection.disconnect();
      break;
    case "time":
    case "t":
    case "tz":
      console.log("calling with " + args.join(" "));
      message.channel.send(await timezone(args.join(" ")));
      break;
    default:
      break;
  }
};

client.login(token);

function startRevolution() {
  nr = Math.floor(Math.random() * Math.floor(1000));
  revolution = nr === 1;
  return revolution;
}

function calcRoyalWapons(BaseCritRate, basicDamage, critDamge) {
  var royalBuff = 8;
  var maxStack = 5;
  var stacks = 0;
  var critRate = BaseCritRate;
  var critCap = 100;
  var damageDone = 0;
  var critCount = 0;
  var critDamge = 100;

  for (var i = 0; i < 100; i++) {
    var hit = Math.floor(Math.random() * Math.floor(critCap));
    if (hit <= critRate) {
      damageDone += basicDamage * critDamge;
      critCount++;
      stacks = 0;
      critRate = BaseCritRate;
    } else {
      damageDone += basicDamage;
      if (stacks > maxStack) {
        stacks++;
        critRate += royalBuff;
        if (critRate > 100) {
          critRate = 100;
        }
      }
    }
  }

  return `damage done:${damageDone} crits hit: ${critCount}`;
}

async function playStupidVoice(message) {
  const args = message.content
    .slice(`${prefix}stupid`.length)
    .trim()
    .split(/ +/);
  const command = args.shift().toLowerCase();

  if (!connection) {
    connection = joinVoiceChannel({
      channelId: message.member.voice.channelId,
      guildId: message.guildId,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    //   connection = await message.member.voice.channel.join();
  } else {
    playAudio();
  }

  playAudio = () => {
    console.log(
      "The connection has entered the Ready state - ready to play audio!"
    );

    // Check if file exists
    let extension = ".mp3";
    fs.stat(`public/sounds/${command}${extension}`, (err, stats) => {
      if (err) {
        message.channel.send("Audio file not found");
        return;
      }
    });

    const resource = createAudioResource(
      path.resolve("public", "sounds", command + extension)
    );

    const player = createAudioPlayer();
    player.play(resource);
    // Play le file

    connection.subscribe(player);
    player.on(AudioPlayerStatus.Idle, () => {
      console.log("audio has finished playing!");

      let num = Math.fround(Math.random() * 100);
      let chance = 50;
      message.channel.send(
        `num ${num} chance ${chance}: ${
          num > chance ? "and again!" : "akwụna " + command
        }`
      );
      if (num > chance) playStupidVoice(message);
    });
  };

  connection.on(VoiceConnectionStatus.Ready, playAudio);

  console.log("attempting connection");

  return;
  var dispatcher = connection.play(
    path.resolve("public", "sounds", command + extension)
  );

  dispatcher.on("start", () => {
    console.log("audio is now playing!");
  });

  dispatcher.on("finish", () => {
    console.log("audio has finished playing!");

    let num = Math.fround(Math.random() * 100);
    let chance = 50;
    message.channel.send(
      `num ${num} chance ${chance}: ${
        num > chance ? "and again!" : "akwụna " + command
      }`
    );
    if (num > chance) playStupidVoice(message);
  });
}
