//require("dotenv").config();
const token = process.env.DISCORD_BOT_SECRET;
const keep_alive = require('./keep_alive.js');

//=========== Installing dependencies ===========\\
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const getGenInfo = require("./GlobalFuncs/BioRemoveFuncs").getGenInfo;
const updateDB = require("./GlobalFuncs/BioRemoveFuncs").updateDB;

//=========== Discord ===========\\
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
Intents.FLAGS.GUILD_INTEGRATIONS] });
//const client = new Discord.Client();

//=========== Embed Stuff ===========\\
const version = "v5.0.1";
const OldVersion = "v5";
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

//On interaction event (e.g Buttons) ------------------------------
client.on('interactionCreate', interaction => {
  if (interaction.isButton()) {
    // If a button is pressed.
    if (interaction.customId === "real" || interaction.customId === "fake") {
      // If the button is either a "Real Ray" or "Fake Ray" button.
      // Get data from JSON.
      const questiondata = JSON.parse(fs.readFileSync("./ray-db.json", "utf8"))
      let answer = questiondata["answer"];
      let user = questiondata["user"];
      if (interaction.user.id === user) {
        // If the user clicking the button and the one who used the command are the same:
        (async function() {
          // Mongo Stuff
          const rayDatabase = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          await rayDatabase.connect();
          const RayPointsCollection = await rayDatabase.db("BrooklynNineNine").collection("RayPoints");
          // Try to find the user in the database.
          const FindRayUser = await RayPointsCollection.findOne({ "UserID": user });
          let PrevPoints = "";
          if (FindRayUser == null) {
            // If no user in the database is found, set their points to 0.
            PrevPoints = 0
          } else {
            // If the user is found in the database, set their points to the value found.
            PrevPoints = FindRayUser.Points
          }
          //----- GIFS -----\\ 
          let yay = [
            "https://media.discordapp.net/attachments/930396635773681664/984767210935431209/IMG_3174.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767211220639744/IMG_3173.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767211703005234/IMG_3172.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767212130795561/IMG_3171.gif"
          ]
          let bad = [
            "https://media.discordapp.net/attachments/930396635773681664/984769154961768519/IMG_3175.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984769167288860682/IMG_3176.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984769221055635496/IMG_3178.webp",
          ]
          // Selecting a random gif.
          let yayGif = yay[Math.floor(Math.random() * yay.length)];
          let sadGif = bad[Math.floor(Math.random() * bad.length)];
          if (interaction.customId === "real") {
            // If the "Real Ray" button is selected.
            if (answer === "Real") {
              // If the user answered correctly.
              let msg = interaction.message
              msg.edit({
                embeds: [
                  {
                    color: colour,
                    title: `Bingpot!`,
                    description: `Congratulations <@!${user}>, you selected the correct answer! <:Bingpot:695320673047937137> It was **${answer}**! You now have ${parseInt(PrevPoints) + 1} Ray Points! You can use \`>holtgame\` to play again!`,
                    thumbnail: {
                      url: yayGif
                    }
                  }
                ],
                components: []
              });
              console.log("Correct")
              // Update the user's points in mongo db (PrevPoints + 1). If they aren't found in the database, a document will be created with the values given (this is the "upsert" value). If they are found, the document's data will be updated.
              await RayPointsCollection.findOneAndUpdate({ "UserID": user }, { $set: { "UserID": user, "Points": parseInt(PrevPoints) + 1 } }, { upsert: true });
            } else {
              // If the user answered incorrectly.
              let msg = interaction.message
              msg.edit({
                embeds: [
                  {
                    color: colour,
                    title: `WHY?!`,
                    description: `Unfortunately <@!${user}>, that answer was incorrect. <:JakeFlabbergasted:768846180326309919>  The real answer was **${answer}**!! Better luck next time!`,
                    thumbnail: {
                      url: sadGif
                    }
                  }
                ],
                components: []
              });
              console.log("Incorrect")
            }
          }
          if (interaction.customId === "fake") {
            // If the "Fake Ray" button is selected.
            if (answer === "Fake") {
              // If the user answered correctly.
              let msg = interaction.message
              msg.edit({
                embeds: [
                  {
                    color: colour,
                    title: `Bingpot!`,
                    description: `Congratulations <@!${user}>, you selected the correct answer! <:Bingpot:695320673047937137> It was **${answer}**! You now have ${parseInt(PrevPoints) + 1} Ray Points! You can use \`>holtgame\` to play again!`,
                    thumbnail: {
                      url: yayGif
                    }
                  }
                ],
                components: []
              });
              console.log("Correct")
              // Update the user's points in mongo db (PrevPoints + 1). If they aren't found in the database, a document will be created with the values given (this is the "upsert" value). If they are found, the document's data will be updated.
              await RayPointsCollection.findOneAndUpdate({ "UserID": user }, { $set: { "UserID": user, "Points": parseInt(PrevPoints) + 1 } }, { upsert: true });
            } else {
              // If the user answered incorrectly.
              let msg = interaction.message
              msg.edit({
                embeds: [
                  {
                    color: colour,
                    title: `WHY?!`,
                    description: `Unfortunately <@!${user}>, that answer was incorrect. <:JakeFlabbergasted:768846180326309919>The real answer was **${answer}**!! Better luck next time!`,
                    thumbnail: {
                      url: sadGif
                    }
                  }
                ],
                components: []
              });
              console.log("Incorrect")
            }
          }
          // Write JSON. Set expired to true when button is clicked.
          fs.writeFileSync("./ray-db.json", JSON.stringify({
            user: user,
            message: questiondata.message,
            quote: questiondata.quote,
            answer: answer,
            questionId: questiondata.questionId,
            expired: true,
            timer: false
          }));
        }());
      } else {
        // If the user clicking the button isn't the same user who used the command, send this ephemeral message.
        interaction.reply({ content: `Whoops! This question wasn’t made for you, but for <@!${user}>! You can play yourself by using the \`>holtgame\` command!`, ephemeral: true })
      }
    }
  }
  else if(interaction.isSelectMenu() == true) {
    if(interaction.customId == "bio-remove-menu") { // Custom ID.
      const InteractionValues = interaction.values[0].split("-"); // Splits the value of the selected item into the `type` (bio/words/links/images) and the index to be removed.
      const [type, index] = [InteractionValues[0], parseInt(InteractionValues[1])]; // Assigns the two parts of the interaction.values to variables.
      
      getGenInfo(uri, interaction.channel, interaction.user.id).then(res => { // Getting required information from the Atlas Server.
        let [LinksStr, WordsStr] = [
          "You can just put some random links here. Anything from your YT channel to a random meme.", 
          "Pure emptiness...just the void.....so empty. You should add something here."]; // Default messages.
        
          if(res.result == false) return interaction.update({ content: res.reason });
        const GenInfo = res.data;
        let ConfigUpdate = {};

        // If an interaction menu has been created, it means that the user wants to remove either a quote/word or a link; not their bio or image.
        // So, in this switch case, we only need to check for words and links.
        switch(type) {
          case "words":
            if(GenInfo.words.length == 1)
              GenInfo.words = ["Pure emptiness...just the void.....so empty. You should add something here."];
            else
              GenInfo.words.splice(index, 1);
            ConfigUpdate = { $set: { words: GenInfo.words } };
          break;
            
          case "links":
            if(GenInfo.links.length == 1)
              GenInfo.links = ["You can just put some random links here. Anything from your YT channel to a random meme."];
            else
              GenInfo.links.splice(index, 1);
            ConfigUpdate = { $set: { links: GenInfo.links } };
          break;
         
          default:
            return interaction.update({ content: "[Interaction Collection] Type (arg 1) is not valid. Type must be one of: `bio`, `image`, `words`, or `links`. " });
          break;
        }

        updateDB(GenInfo, uri, interaction.channel, interaction.user.id, type, ConfigUpdate).then(res => {
          if(res == true)
            interaction.update({ content: "Bio page updated successfully. If this is not the case, try again. If this issue persists, please notify a bot developer." });
          else interaction.update({ content: "Error while updating bio DB. Try again. If this issue persists, please notify a bot developer." });
        });
      });
    }
  }  
});


//On message sent event ------------------------------------------
client.on('messageCreate', msg => {
  const MsgWithCaps = JSON.parse(JSON.stringify(msg)); // Deep cloning the msg object so that it retains the capitals.
  // The MsgWithCaps object can be used whenever we need to manipulate the message with its original capitals.
  // Deep Cloning in JS: https://blog.logrocket.com/methods-for-deep-cloning-objects-in-javascript/
  msg.content = msg.content.toLowerCase();

  if(!msg.content.startsWith(prefix) && ["760258600983199764", "789432329168355328"].includes(msg.channel.id)) triviaPointsCollection(uri, msg);
  else if(msg.author.bot || !msg.content.startsWith(prefix)) return;

  console.log("Hello, world!");

  //Creating command arguments
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch(command) {
    case "beans":
      msg.channel.send("Hapines > sadnes");
    break;
    case "help":
      client.commands.get('help').execute(msg, args, prefix);
    break;

    case "topic":
      console.log("TOPIC")
    //if(msg.author.id != "777439703515267082")
      client.commands.get('topic').execute(msg, command, topics, colour);
    break;

    case "triviapts":
      client.commands.get('triviapts').execute(msg, args, typicalEmbed, colour, footer, uri, command);
    break;

    case "trivialb":
      client.commands.get('trivialb').execute(msg, args, typicalEmbed, colour, footer, uri, command);
    break;
      
    case "raypts":
      client.users.fetch(args[0] || msg.author.id).then((user) => {
        client.commands.get('raypts').execute(msg, args, typicalEmbed, user, colour, footer, uri, command);
      });
    break;
    
    case "raylb":
      client.commands.get('raylb').execute(msg, args, typicalEmbed, colour, footer, uri, command);
    break;
      
    case "rayreset":
      if (
        msg.member.roles.cache.has("535155142870433841") == true ||          msg.member.roles.cache.has("938012155293335602") == true ||    msg.member.roles.cache.has("796377773799243776") == true || msg.member.roles.cache.has("535152953862914058") == true){
       client.commands.get('rayreset').execute(msg, args, typicalEmbed, colour, footer, uri, command);
      } else {
        msg.channel.send("You can't do that, Hitchcock.")
      }
    break;
      
      case "ahgwinner":
      client.commands.get('ahgwinner').execute(msg, args, typicalEmbed, colour, footer, uri, command);
      break;

      case "triviawinner":
      client.commands.get('triviawinner').execute(msg, args, typicalEmbed, colour, footer, uri, command);
      break;
      
    case "rules":
      console.log("Rules")
      if(msg.member.roles.cache.has("535155142870433841") == true || msg.member.roles.cache.has("938012155293335602") == true)
        client.commands.get("rules").execute(msg, args, colour, footer);
      else
        msg.channel.send("You can't do that!");
    break;
    
    case "addtrivia":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('785441338065551371') == true || msg.member.roles.cache.has("938012155293335602") == true) {
        client.commands.get("addtrivia").execute(msg, args, typicalEmbed, colour, footer, uri, command);
      } else {
        msg.channel.send("You can't do that!");
      }
    break;

    case "remtrivia":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('785441338065551371') == true) {
        client.commands.get("remtrivia").execute(msg, args, typicalEmbed, colour, footer, uri, command);
      } else {
        msg.channel.send("You can't do that!");
      }
    break;
    
    case "addtopic":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('785441338065551371') == true) {
        client.commands.get("addtopic").execute(msg, args, uri, command);
      } else {
        msg.channel.send("You can't do that!");
      }
    break;
    
    case "remtopic":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('785441338065551371') == true) {
        client.commands.get("remtopic").execute(msg, args, uri, command);
        const data = JSON.parse(fs.readFileSync("./JSONs/topics.json", "utf8"));
        topic = data;
      } else {
        msg.channel.send("You can't do that!");
      }
    break;

    case "holtgame":
      client.commands.get("holtgame").execute(msg, args, colour, footer, command, RayQuotes);
    break;

    case "suggestquote":
      client.commands.get("suggestquote").execute(msg, args, client.channels.cache.get("930396635773681664"), command);
    break;

    case "suggesttopic":
      client.commands.get("suggesttopic").execute(msg, args, client.channels.cache.get("769483384849563648"), command);
    break;

    case "addrayquote":
      if (
        msg.member.roles.cache.has("535155142870433841") == true ||          msg.member.roles.cache.has("938012155293335602") == true ||    msg.member.roles.cache.has("796377773799243776") == true || msg.member.roles.cache.has("535152953862914058") == true){
        if (args[0]) {
          if (args[0].toLowerCase() === `real` || args[0].toLowerCase() === `fake`) {
            let argsAnswer = args[0].toLowerCase()
              client.commands.get("addrayquote").execute(msg, args, colour, argsAnswer, footer, uri, command);
          } else { msg.channel.send(`Not enough arguments passed. Syntax is \`>addrayquote <Real/Fake:Answer> <Quote:Question>\`.`) } } else { msg.channel.send(`Not enough arguments passed. Syntax is \`>addrayquote <Real/Fake:Answer> <Quote:Question>\`.`) }
      } else { msg.channel.send("You can't do that!"); }
    break;

    case "remrayquote":
      if (
        msg.member.roles.cache.has("535155142870433841") == true ||          msg.member.roles.cache.has("938012155293335602") == true ||    msg.member.roles.cache.has("796377773799243776") == true || msg.member.roles.cache.has("535152953862914058") == true){
        client.commands.get("remrayquote").execute(msg, args, colour, footer, uri, command);
      } else { msg.channel.send("You can't do that!"); }
    break;

    case "ping":
      msg.channel.send("Pinging...").then(m =>{
        // The math thingy to calculate the user's ping
          var ping = m.createdTimestamp - msg.createdTimestamp;

        // Basic embed
          var embed = new MessageEmbed()
          .setAuthor(`Your ping is ${ping}`)
          
          // Then It Edits the message with the ping variable embed that you created
          m.edit(embed)
      });
    break;

    case "qotw":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('889829830483398657') == true || msg.member.roles.cache.has("938012155293335602") == true) {
        client.commands.get("qotw").execute(msg, args, client, colour, footer);
      } else msg.channel.send("You need to be a moderator or above to do this, Hitchcock.");
    break;
      
    case "bio":
      client.commands.get("bio").execute(msg, args, colour, footer, command, client, uri);
    break;

    case "bioadd":
      client.commands.get("bioadd").execute(msg, args, colour, footer, command, client, uri, MsgWithCaps, prefix);
    break;

    case "bioremove":
      client.commands.get("bioremove").execute(msg, args, colour, footer, command, client, uri);
    break;

    case "trivia drop":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('889829830483398657') == true || msg.member.roles.cache.has("938012155293335602") == true) {
        client.commands.get("triviadrop").execute(msg, args, client, uri);
      } else { msg.channel.send("You need to be a mod to reset trivia, Hitchcock."); }
    default:
      break;
  }
});

function triviaPointsCollection(uri, msg) {
  console.log("trivia points collection func")
  const filter = (reaction, user) => { return reaction.emoji.name === "✅" && user.id != msg.author.id }


  const collector = msg.createReactionCollector({ filter, time:60000 });

  collector.on("collect", (reaction, user) => {
    console.log("correct emoji")
    if(reaction.emoji.name === "✅") {
      console.log("correct emoji")
      if(reaction.count > 1) return msg.channel.send("❌ You can only react with ✅ **once** per message, and that person who reacts **needs to be the questioner!**");
      
      queryDB(uri);
    }
  });

  collector.on("end", collected => {
    console.log(`Collected ${collected.size} items`);
  });

  async function queryDB(uri) {
    console.log("querying mongo")
    console.log("async fcuntion")
    const database = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await database.connect();
      const TriviaCollection = await database.db("BrooklynNineNine").collection("B99");
      const sort = { length: -1 };

      const result = await TriviaCollection.findOne({"UserID":msg.author.id});
      console.log(result);

      if(result != null) {
        const MyQuery = {"UserID":msg.author.id};
        const NewQuery = { $set: {"UserID": result["UserID"],"TriviaPoints": result["TriviaPoints"]+1} };
        const res = await TriviaCollection.updateOne(MyQuery, NewQuery);
        return;            
      } else {
        const doc = {"UserID": msg.author.id,"TriviaPoints": 1};
        const InsertDoc = await TriviaCollection.insertOne(doc);
        return;    
      }    
    } catch(e) {
      msg.channel.send("Error while adding point. Full error in console.");
    } finally { database.close(); } 

  }
}

/* LEGACY CODE - Discord.js v12 and below
client.on("messageReactionAdd", (reaction, user) => {
  console.log("messageReactionAdd")
  if(reaction.emoji.name == "✅" & user.id != reaction.message.author.id) {
    console.log("detected reaction")
    if(reaction.message.channel == client.channels.cache.get('760258600983199764')) {
      console.log("channel confirmed")

      async function queryDB(uri) {
        console.log("async fcuntion")
        const database = new MongoClient(uri, {
          userNewUrlParser: true,
          useUnifiedTopology: true,
        });
        try {
          await database.connect();
          const TriviaCollection = await database.db("BrooklynNineNine").collection("B99");
          const sort = { length: -1 };

          const result = await TriviaCollection.findOne({"UserID":reaction.message.author.id});
          console.log(result);

          if(result != null) {
            const MyQuery = {"UserID":reaction.message.author.id};
            const NewQuery = { $set: {"UserID": result["UserID"],"TriviaPoints": result["TriviaPoints"]+1} };
            const res = await TriviaCollection.updateOne(MyQuery, NewQuery);
            return;            
          } else {
            const doc = {"UserID": reaction.message.author.id,"TriviaPoints": 1};
            const InsertDoc = await TriviaCollection.insertOne(doc);
            return;    
          }    
        } catch(e) {
          reaction.message.channel.send("Error while adding point. Full error in console.");
        } finally { database.close(); } 

      }
      queryDB(uri);


    }
  }
});
*/
//Embed function for general use.
function typicalEmbed(desc, title, footer, colour) {
  const Embed = new MessageEmbed()
  .setColor(colour)
  .setTitle(title)
  .setDescription(desc)
  .setTimestamp()
  .setFooter(footer);

  return Embed;
}


client.login(token); //Bot logging into Discord.
