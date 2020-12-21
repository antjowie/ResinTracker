const { table } = require("table");
const dbHandler = require("./database_handler");
dbHandler.initialize(false);
var genshinDict;

function setDictionary(dictionary){
    genshinDict = dictionary;
}

async function farmHandler(args, userId) {
    if (!args[0]) {
        try {
        var team = (await dbHandler.get("resin", userId)).team;
        var day = new Date().getDay();
        
        if (day === 0) {
            return "you can farm all books today";
        }

        let farmCharacters = [
            ["Talent", "Name", "Location"]
        ];

        team.forEach(name => {
            var char = genshinDict.chars[name];
            var talent = char.talent;
            if ((day - 1) % 3 === genshinDict.talents[talent]) {
                farmCharacters.push([talent, name, "Still dont have a location object"]);
            }
        });

        return "```" + table(farmCharacters) + "```";
        } catch(e){
            console.log(e);
            return 'kek'
        }

    } else if (args[0] === 'add') {
        var user = await dbHandler.get("resin", userId);

        if (genshinDict.chars[args[1]] && user.team.indexOf(args[1])) {
            user.team.push(args[1]);
            await dbHandler.set("resin", userId, { "team": user.team });
            return `your team has been updated`;
        } else {
            return `could not find ${args[1]}`
        }
    }
    else if (args[0] === 'set') {
        args.shift();
        var user = await dbHandler.get("resin", userId);

        for (var i = 0; i < args.length; i++) {
            var char = genshinDict.chars[args[i]];

            if (!char) {
                return `could not find ${args[i]}`;
            }
        }
        await dbHandler.set("resin", userId, { "team": args });
        return `your team has been updated`;

    } else if (args[0] === 'remove') {
        var user = await dbHandler.get("resin", userId);

        for (var i = 1; i < args.length; i++) {
            if (genshinDict.chars[args[i]] && user.team.indexOf(args[i])) {
                user.team.splice(user.team.indexOf(args[i]), 1);
            } else {
                return `could not remove ${args[i]} from the users team`;
            }
        }

        await dbHandler.set("resin", userId, { "team": user.team });
        return `your team has been updated ${user.team}`;

    } else if (args[0] === 'get') {
        var user = await dbHandler.get("resin", userId);
        return `${user.team}`;
    } else {
        return `command could not be found`;
    }
}

module.exports = {
    farmHandler,
    setDictionary
}
