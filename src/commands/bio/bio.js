const MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'bio',
	description: "Your personal B99 page!",
	execute(msg, args, colour, footer, command, client, uri) {
    let user = msg.author;
    let [bio, LinksStr, WordsStr, image] = ["Your bio....It's lookin' a little empty...", "You can just put some random links here. Anything from your YT channel to a random meme.", "Pure emptiness...just the void.....so empty. You should add something here.", "https://cdn.discordapp.com/attachments/930396635773681664/992032156362735636/b99_cast.jpg"];
    if(args.length > 0 && args[0] == "create") return createBio(bio, LinksStr, WordsStr, image, msg.author.id, uri, msg);
    else if(args.length > 0) user = msg.mentions.users.first();
    //else if(args.length == 0) msg.channel.send("Usage: `>bio` on its own returns the bio page of the user who executed the command. `>bio create` sets up a new bio page for the user who executed the command. `>bio @user` returns the bio page of the mentioned user.");
    
    // Fetch a single member
    client.guilds.fetch("535148342078865409").then(guild => { // Getting the B99 guild object.
      guild.members.fetch(user.id).then(member => { // Grabbing the member object using the UserID. Note: MEMBER is different to USER.
        ahgWinner(uri, msg).then(IsAHG => {
          triviaWinner(uri, msg).then(IsTrivia => {
            generalInfo(uri, msg).then(IsGood => {
              let StatsString = "🏅 Highest role:\n<@&" + highestRole(msg, member) + ">\n\n";
              if(IsAHG == true) StatsString += "👑 *Amazing Human/Genius Winner*\n\n";
              if(IsTrivia.result == true) StatsString += "🏆 *" + IsTrivia.num + " time trivia winner*\n\n";
              if(IsGood.result == true) {
                data = IsGood.data;
                try { bio = data.bio } catch { bio = "Your bio....It's lookin' a little empty..." }
                let LinkArr = null
                try {
                  LinksArr = data.links;
                  LinksStr = LinksArr.join("\n");
                } catch {
                  LinksStr = "You can just put some random links here. Anything from your YT channel to a random meme.";
                }
                
                let WordsArr = null
                try {
                  WordsArr = data.words;
                  WordsStr = WordsArr.join("\n");
                } catch {
                  WordsStr = "Pure emptiness...just the void.....so empty. You should add something here.";
                }

                try { image = data.image } catch { image = "https://cdn.discordapp.com/attachments/930396635773681664/992032156362735636/b99_cast.jpg" }
              }
              console.log(image)
              msg.channel.send({
                embeds: [{
                  title: member.nickname,
                  description: "@" + user.username,
                  fields: [
                    {
                      name: "Tell us Something ✨ S P E C I A L ✨",
                      value: bio,
                      inline: false
                    },
                    {
                      name: "Good, inspirational, or just funny quotes?",
                      value: WordsStr,
                      inline: false
                    },
                    {
                      name: "Various Links",
                      value: LinksStr,
                      inline: true
                    },
                    {
                      name: "Server Stats",
                      value: StatsString,
                      inline: true
                    }
                  ],
                  color: colour,
                  thumbnail: {
                    url: image
                  },
                  timestamp: new Date(),
                  footer: {
                    text: footer
                  }
                }]
              });              
            });
          });
        });
      })
    });

  },
};

async function createBio(BioStr, LinksStr, WordsStr, ImageStr, UserID, uri, msg) {
  console.log(BioStr, LinksStr, WordsStr, ImageStr)
	console.log("async fcuntion")
	const mongo = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
  
	try {
		await mongo.connect();
		const collection = await mongo.db("YouPersonal").collection("GeneralInfo");
    const filter = { "UserID": UserID };
    const options = { upsert: true }; // Create a document if no document already exists.
    const doc = { $set: {
      UserID: UserID,
      bio: BioStr,
      words: [WordsStr],
      links: [LinksStr],
      image: ImageStr
    } };
		const data = await collection.updateOne(filter, doc, options);
    if(data != null || data != undefined) msg.channel.send("Bio page created. Use `>bioadd` and `>bioremove` to edit it.");
    else msg.channel.send("Unable to create bio page.");
	} catch(e) {
		msg.channel.send("Error while creating bio page.");
		console.log("Error while creating bio page:\n ");
    console.log(e);
	} finally { mongo.close(); }    
}


async function generalInfo(uri, msg) {
	console.log("async fcuntion")
	const mongo = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
  
	try {
		await mongo.connect();
		const collection = await mongo.db("YouPersonal").collection("GeneralInfo");
		const data = await collection.find({ UserID: msg.author.id }).toArray();
    if(data != null || data != undefined)
      return { result: true, data: data[0] };
    else return { result: false, reason: "Your 'You' page has not been set up. Use one of the set up commands." };
	} catch(e) {
		msg.channel.send("Error while gettng trivia winner data.");
		console.log("Error while gettng trivia winner data:\n " + e);
	} finally { mongo.close(); }     
}

function highestRole(msg, member) {
  const RoleObj = member.roles.highest;
  return RoleObj.id;
}

async function triviaWinner(uri, msg) {
	console.log("async fcuntion")
	const mongo = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
  
	try {
		await mongo.connect();
		const collection = await mongo.db("YouPersonal").collection("TriviaWinners");
		const data = await collection.findOne({ UserID: msg.author.id });
    if(data != null || data != undefined)
      return { result: true, num: data.TimesWon };
    else return { result: false, num: null };
	} catch(e) {
		msg.channel.send("Error while gettng trivia winner data.");
		console.log("Error while gettng trivia winner data:\n " + e);
	} finally { mongo.close(); }   
}

async function ahgWinner(uri, msg) {
	console.log("async fcuntion")
	const mongo = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
  
	try {
		await mongo.connect();
		const collection = await mongo.db("YouPersonal").collection("AHGWinners");
		const data = await collection.findOne({ UserID: msg.author.id });
    if(data != null || data != undefined)
      return true;
    else return false;
	} catch(e) {
		msg.channel.send("Error while gettng AH/G winner data.");
		console.log("Error while gettng AH/G winner data:\n " + e);
	} finally { mongo.close(); } 
}