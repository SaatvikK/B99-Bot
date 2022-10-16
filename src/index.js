require("dotenv").config();
const token = process.env.DISCORD_BOT_SECRET;
const keep_alive = require('./keep_alive.js');

//=========== Installing dependencies ===========\\
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

//=========== Discord ===========\\
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
Intents.FLAGS.GUILD_INTEGRATIONS] });
//const client = new Discord.Client();

//=========== Embed Stuff ===========\\
const version = "v6";
const OldVersion = "v5.0.1";
const colour = '#F8E71C';
const footer = "Meep Morp Robot " + version + " | /r/brooklynninenine Official Discord";

//=========== Prefix Stuff ===========\\
const data = JSON.parse(fs.readFileSync("./JSONs/general.json", "utf8"));
let prefix = data["Prefix"];

//=========== Mongo Stuff ===========\\
//Mongo URI
const MongoUsername = process.env.MONGO_USERNAME;
const MongoPassword = process.env.MONGO_PASSWORD;
const uri = "mongodb+srv://" + MongoUsername + ":" + MongoPassword + "@testcluster.8mz1j.mongodb.net/BrooklynNineNine?retryWrites=true&w=majority";