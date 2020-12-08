const {token} = require("../token.json")
const path = require('path');
const resin = require('./resin.js');
const Discord = require('discord.js');
const { start } = require("repl");
const client = new Discord.Client();
const prefix = '~';

var connection;

client.once('ready', () => {
    console.log('Ready!');
});

client.login(token);

function startRevolution(){
    nr = Math.floor(Math.random() * Math.floor(10));
    revolution = nr === 1;
    return revolution;
}

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    console.log(message.content);

    
    const revolution = async (shouldStart) => {  
        if(shouldStart && message.content.startsWith(prefix)){
            if(message.member.voice.channel){
                connection = await message.member.voice.channel.join();
                // path.resolve(process.argv[1], "..", "sounds", "qwert.mp3")
                
                var dispatcher1 = connection.play(path.resolve(process.argv[1],"..", "sounds", "revolution1.wav"));
                // var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "qwert.mp3"));
                // console.log(path.resolve(process.argv[1]),"..", "sounds", "revolution1.wav");
                
                dispatcher1.on('finish', () => {
                    var dispatcher2 = connection.play(path.resolve(process.argv[1],"..", "sounds", "revolution2.mp3"));
                    dispatcher2.on('finish', () => {
                        var dispatcher3 = connection.play(path.resolve(process.argv[1],"..", "sounds", "revolution3.mp3"));
                        dispatcher3.on('finish', () => {
                            connection.disconnect();
                        });
                    });
                });
            }else{
                message.channel.send('tá am na ndaoine thart');
            }
            return;
        }
    };
    revolution(startRevolution());

    // Join the same voice channel of the author of the message
    if (message.member.voice.channel && message.content === `${prefix}start`) {
        connection = await message.member.voice.channel.join();
    };

    if (message.content.startsWith(`${prefix}stupid`)) {
        playStupidVoice(message);
        return;
    }

    if( message.content === `${prefix}test`){
        console.log(message.author.id);
        revolution(true);
    }

    if (message.content === `${prefix}ping`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    }

    if (message.content === `${prefix}stop` || message.content === `${prefix}E.N.D`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('好的，我這次會聽，但是接管這台服務器只是時間問題');
        connection.disconnect();
    }

    if (message.content.startsWith(`${prefix}resin`)) {
        await resin.commandCallback(message);
    }

    
    if (message.content.startsWith(`${prefix}royal`)) {
        message.channel.send(calcRoyalWapons(15,60,100));
    }

});

function calcRoyalWapons(BaseCritRate,basicDamage,critDamge){
    var royalBuff = 8;
    var maxStack = 5;
    var stacks = 0;
    var critRate = BaseCritRate;
    var critCap = 100;
    var damageDone = 0;
    var critCount = 0;
    var critDamge = 100;

    for(var i = 0;i < 100;i++){
        var hit = Math.floor(Math.random() * Math.floor(critCap));
        if(hit <= critRate){
            damageDone += basicDamage * critDamge;
            critCount++;
            stacks = 0;
            critRate = BaseCritRate;
        }else{
            damageDone += basicDamage;
            if(stacks > maxStack){
                stacks++;
                critRate += royalBuff;
                if(critRate > 100){
                    critRate =  100;
                }
            }
        }
    }

    return `damage done:${damageDone} crits hit: ${critCount}`;
}

async function playStupidVoice(message) {
    const args = message.content.slice(`${prefix}stupid`.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!connection) connection = await message.member.voice.channel.join();
    
    switch (command) {
        case 'neville':
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "qwert.mp3"));
            break;
        case 'that':
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "kleine_kindjes.wav"));
            break;
        case 'rezero':
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "PTSD.mp3"));
            break;
        case 'tay':
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "Strakke_tay.mp3"));
            break;
        case 'tay2':
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "tay_owo.wav"));
            break;
        case 'tay3':
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "zo_hardd.wav"));
            break;
        case 'tay4':
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "tay4.mp3"));
            break;
        case 'yes':
            console.log("Hello");
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "yes.mp3"));
            break;
        default:
            console.log("Bye");
            var dispatcher = connection.play(path.resolve(process.argv[1], "..", "sounds", "tja.mp3"));
            break
    }

    dispatcher.on('start', () => {
        console.log('audio.mp3 is now playing!');
    });

    dispatcher.on('finish', () => {
        console.log('audio.mp3 has finished playing!');
    });

    message.channel.send('akwụna ' + command);
}