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

//Query Mongo for bulk commands
async function mongoQuery(uri) {
  console.log("async fcuntion")
  const database = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await database.connect();
    const TopicsCollection = await database.db("BrooklynNineNine").collection("topics");
    const WinningNumsCollection = await database.db("BrooklynNineNine").collection("Cupcakes");
    const ShopCollection = await database.db("BrooklynNineNine").collection("shop");
    const HoltGameCollection = await database.db("BrooklynNineNine").collection("RayQuotes");
    return [
      await TopicsCollection.find({}).toArray(), 
      await WinningNumsCollection.findOne({"identifier":1}), 
      await ShopCollection.find({}).toArray(),
      await HoltGameCollection.find({}).toArray()
    ];
  } catch(e) {
    console.log(e)
  }
  finally { database.close(); }
}

let [topics, cupcakes, WinningNums, shop, RayQuotes] = [null, null, null, null, null];

mongoQuery(uri).catch(console.dir).then(results => { 
  [topics, WinningNums, shop, RayQuotes] = [results[0], results[1], results[2], results[3]]; 
});

//Commands Collection Client
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

