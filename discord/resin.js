const bent = require('bent')

const getJSON = bent('json')
const getBuffer = bent('buffer')
const resinValue = 8 * 60;
const resinCap = 160;

// let obj = await getJSON('http://site.com/json.api')
// let buffer = await getBuffer('http://site.com/image.png')

// Returns resin in seconds
const getResin = async (id) => await getJSON(`https://resintracker.netlify.app/api/getResin?&discord=${id}`);    

// Set the resin, expected in resin value
const setResin = async (id, resin) => await getJSON(`https://resintracker.netlify.app/api/setResin?&discord=${id}&resin=${resin}`);

const getTimeAtResinCap = (resinSec) => {
    const resinLeftSec = resinCap * resinValue - resinSec;
    // const current = Date(Date().now() + resinLeftSec * 1000);
    const dateAtCap = new Date(Date.now() + resinLeftSec * 1000);
    
    // return dateAtCap.toLocaleTimeString();
    return dateAtCap.toTimeString().substr(0,8);
    // return `${dateAtCap.toDateString()} ${dateAtCap.toTimeString()}`;
    // console.log(dateAtCap.toDateString());
    // console.log(dateAtCap.toTimeString());
}

const sendResinMessage = (message, resinSec) => {
    let timeLeft = new Date((resinValue * resinCap - resinSec) * 1000).toISOString().substr(11,8);
    const author = `<@${message.author.id}>`;
    const currentResin = Math.floor(resinSec / resinValue);
    
    message.channel.send(`${author} **Resin** ${currentResin}/${resinCap} | **Left** ${timeLeft} | **Capped at** ${getTimeAtResinCap(resinSec)}`);
}

const commandCallback = async (message) => {
    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();
    // console.log(command);
    // console.log(args);
    
    if(args.length == 0) {
        return message.channel.send(`<@${message.author.id}> Invalid args: get | set resin`);
    }
    
    if(args[0] === "get") {
        let resinSec = await getResin(message.author.id);
        sendResinMessage(message,resinSec);
    }
    else if (args[0] === "set") {
        // TODO: Data validation
        // if(args[1])
     
        console.log(args[1]);
        
        await setResin(message.author.id, args[1]);
        
        let resinSec = args[1] * resinValue//await getResin(message.author.id);
        sendResinMessage(message,resinSec);
    }
}

module.exports = {
    commandCallback
}

console.log(getTimeAtResinCap(80 * resinValue));

// const test = async() =>
// {    
//     console.log(await getResin("user1"));
//     console.log(await setResin("user1",1));
//     console.log(await getResin("user1"));
// }
// test();