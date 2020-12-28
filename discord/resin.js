const db = require("./database_handler.js");
const Discord = require("discord.js");
const resinValue = 8 * 60;
const resinCap = 160;
// db.initialize(false);

// Returns resin in seconds
const getResin = async (id) => {
    const data = await db.get("resin", id);
    let { last, resin } = data;

    // Calculate new resin value
    const lastTime = last;
    const currentTime = Math.floor(Date.now() / 1000);
    const deltaTime = Math.floor(currentTime - lastTime);

    resin = Math.min(resin + deltaTime, resinCap * resinValue);

    // Update the resin value
    await db.set("resin", id, {
        resin: resin,
        last: currentTime,
    });

    return resin;
};

// Set the resin, expected in resin value
const setResin = async (id, resin) => {
    await db.set("resin", id, {
        resin: resin * resinValue,
        last: Math.floor(Date.now() / 1000),
    });
};

// The timestamp at which your resin is capped
const getTimeAtResinCap = (resinSec) => {
    const resinLeftSec = resinCap * resinValue - resinSec;
    // const current = Date(Date().now() + resinLeftSec * 1000);
    const dateAtCap = new Date(Date.now() + resinLeftSec * 1000);

    // return dateAtCap.toLocaleTimeString();
    return dateAtCap.toTimeString().substr(0, 8);
    // return `${dateAtCap.toDateString()} ${dateAtCap.toTimeString()}`;
    // console.log(dateAtCap.toDateString());
    // console.log(dateAtCap.toTimeString());
};

// Send the Discord message in the chat
const sendResinMessage = (message, resinSec) => {
    let timeLeft = new Date((resinValue * resinCap - resinSec) * 1000)
        .toISOString()
        .substr(11, 8);
    const author = `<@${message.author.id}>`;
    const currentResin = Math.floor(resinSec / resinValue);

    message.channel.send(
        `${author} **Resin** ${currentResin}/${resinCap} | **Left** ${timeLeft} | **Capped at** ${getTimeAtResinCap(
            resinSec
        )}`
    );
};

let alerts = {};
const resinAlertOffset = 10 * resinValue;

const createAlert = (user) => {
    // console.log(user)
    let localUser = user;
    return () => {
        localUser.send(`Heads up! Your resin will be capped at ${getTimeAtResinCap(resinAlertOffset)}!`);
    };
};

const addAlert = (user, resin) => {
    if(user.id in alerts) {
        clearTimeout(alerts[user.id]);
    }
    
    // Calcuate timeout time
    let time = resinCap * resinValue - resin - resinAlertOffset;
    
    alerts[user.id] = setTimeout(createAlert(user), time * 1000);
};

const setupAlerts = async (discordClient) => {
    const users = await db.getDocuments("resin");
    console.log("Setting up alerts");

    for (id in users) {
        try {
            let resin = users[id].resin;
            let client = await discordClient.users.fetch(id);
            // client.send("Registering your resin alert...");
            addAlert(client, users[id].resin);
            console.log(`Added ${client.username} to alerts`);
        } catch (error) {
            console.log(`Failed to add ${id} to alerts with ${error}`);
        }
    }
};

const commandCallback = async (message) => {
    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();
    // console.log(command);
    // console.log(args);

    if (args.length == 0) {
        return message.channel.send(
            `<@${message.author.id}> Invalid args: get | set resin`
        );
    }

    if (args[0] === "get") {
        let resinSec = await getResin(message.author.id);
        sendResinMessage(message, resinSec);
    } else if (args[0] === "set") {
        // TODO: Data validation
        // if(args[1])

        console.log(args[1]);

        await setResin(message.author.id, args[1]);
        
        // let resinSec = args[1] * resinValue
        let resinSec = await getResin(message.author.id);
        sendResinMessage(message, resinSec);
        addAlert(message.author, resinSec);
    }
};

module.exports = {
    commandCallback,
    setupAlerts
};

if (require.main !== module) return;

console.log(getTimeAtResinCap(80 * resinValue));

const test = async () => {
    console.log(await getResin("user1"));
    console.log(await setResin("user1", 1));
    console.log(await getResin("user1"));
};
test();
