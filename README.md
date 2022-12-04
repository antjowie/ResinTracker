# NOTE
**This is definitely not a genshin bot anymore. ** Just use the run.bat script to run the bot

## Installation
Required node and python. Have a token.json file with one element representing the token.
```json
{
    "token": "discordToken"
}
```

## What was ResinTracker?
Resin is the 'energy currency' of [Genshin Impact][gensinimpact] (GI). The ResinTracker project is a fullstack project. For the frontend you can check out the [Discord bot][discord] (that will notify you when your Resin is about to cap) or the [web app][website]. To read more about the technologies go to [services](#services).

## What is Genshin Impact and Resin?
[Genshin Impact][gensinimpact] (GI) is a beautiful game that unfortunately has taken all my time as of lately.  
Since it is a Gacha game, time-gating practices are put into practice. In GI this is known as Resin (your energy equivalent for most mobile games). To no longer be worried about maxing my Resin and optimizing my already no life schedule, I have decided to create this project to track it.

## Development
Feel free to contribute to this project. You can use anything in this project, just make sure to credit me.

## Services
Frontend:
* Web app is hosted on Firebase
* Discord bot will _likely_ be hosted on Heroku

Backend:
* Web API is using Netlify functions. We're not running our own server (I think it's JAMStack)
* Database is hosted on Firebase.

[website]:https://resintracker.web.app/
[gensinimpact]:https://genshin.mihoyo.com/en
[discord]:#