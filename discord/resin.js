const bent = require('bent')

const getJSON = bent('json')
const getBuffer = bent('buffer')

// let obj = await getJSON('http://site.com/json.api')
// let buffer = await getBuffer('http://site.com/image.png')

// Returns resin in seconds
const getResin = async (id) => await getJSON(`https://resintracker.netlify.app/api/getResin?&discord=${id}`);    

// Set the resin, expected in resin value
const setResin = async (id, resin) => await getJSON(`https://resintracker.netlify.app/api/setResin?&discord=${id}&resin=${resin}`);

const commandCallback = async (message) => {
    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();
    // console.log(command);
    // console.log(args);
    
    if(args.length == 0) {
        return message.channel.send(`<@${message.author.id}> Invalid args: get | set resin`);
    }
    
    const resinValue = 8 * 60;
    const resinCap = 160;
    
    if(args[0] === "get") {
        let resinSec = await getResin(message.author.id);
        let timeLeft = new Date((resinValue * resinCap - resinSec) * 1000).toISOString().substr(11,8);
        message.channel.send(`<@${message.author.id}> Resin ${Math.floor(resinSec / resinValue)}/${resinCap} ${timeLeft} left`);
    }
    else if (args[0] === "set") {
        // TODO: Data validation
        // if(args[1])
     
        console.log(args[1]);
        
        await setResin(message.author.id, args[1]);
        
        let resinSec = await getResin(message.author.id);
        let timeLeft = new Date((resinValue * resinCap - resinSec) * 1000).toISOString().substr(11,8);
        message.channel.send(`<@${message.author.id}> Resin ${Math.floor(resinSec / resinValue)}/${resinCap} ${timeLeft} left`);
    }
}

module.exports = {
    commandCallback
}

// const test = async() =>
// {    
//     console.log(await getResin("user1"));
//     console.log(await setResin("user1",1));
//     console.log(await getResin("user1"));
// }
// test();