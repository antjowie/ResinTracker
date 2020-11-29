const {token} = require("../token.json")
const resin = require('./resin.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '~';

var connection;

client.once('ready', () => {
    console.log('Ready!');
});

client.login(token);

function startRevolution(){
    nr = Math.floor(Math.random() * Math.floor(20));
    revolution = nr === 1;
    return revolution;
}

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    console.log(message.content);

    if(startRevolution() && message.content.startsWith(prefix)){
        if(message.member.voice.channel){
            connection = await message.member.voice.channel.join();
            var dispatcher1 = connection.play(`${process.argv[1]}/../sounds/revolution1.wav`);
        
            dispatcher1.on('finish', () => {
                var dispatcher2 = connection.play(`${process.argv[1]}/../sounds/revolution2.mp3`);
                dispatcher2.on('finish', () => {
                    var dispatcher3 = connection.play(`${process.argv[1]}/../sounds/revolution3.mp3`);
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
    }

    if (message.content === `${prefix}ping`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    }

    if (message.content === `${prefix}berat`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('지우다');
    }

    if (message.content === `${prefix}stop`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('好的，我這次會聽，但是接管這台服務器只是時間問題');
        connection.disconnect();
    }

    if (message.content === `${prefix}E.N.D`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('好的，我這次會聽，但是接管這台服務器只是時間問題');
        connection.disconnect();
    }

    if (message.content.startsWith(`${prefix}resin`)) {
        await resin.commandCallback(message);
    }

});

function playStupidVoice(message) {
    const args = message.content.slice(`${prefix}stupid`.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'neville':
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/qwert.mp3`);
            break;
        case 'that':
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/kleine_kindjes.wav`);
            break;
        case 'rezero':
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/PTSD.mp3`);
            break;
        case 'tay':
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/Strakke_tay.mp3`);
            break;
        case 'tay2':
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/tay_owo.wav`);
            break;
        case 'tay3':
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/zo_hardd.wav`);
            break;
        case 'tay4':
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/tay4.mp3`);
            break;
        case 'yes':
            console.log("Hello");
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/yes.mp3`);
            break;
        default:
            console.log("Bye");
            var dispatcher = connection.play(`${process.argv[1]}/../sounds/tja.mp3`);
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