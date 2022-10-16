const MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');
const fs = require('fs');
const getGenInfo = require("../GlobalFuncs/BioRemoveFuncs").getGenInfo;
const updateDB = require("../GlobalFuncs/BioRemoveFuncs").updateDB;

module.exports = {
	name: 'bioremove',
	description: "Remove S T U F F from your bio page!",
	execute(msg, args, colour, footer, command, client, uri) {
    if(!args.length) return msg.channel.send("Incorrect arguments. Correct usage: `>bioremove [bio/words/links/image]`. Example: `>bioremove bio` or `>bioadd words` (if you try to remove `words` or `links` a select menu will appear).");
    console.log(args)
    const type = args[0];
    
    getGenInfo(uri, msg.channel, msg.author.id).then(res => {
      let [bio, LinksStr, WordsStr, image] = [
        "Your bio....It's lookin' a little empty...", 
        "You can just put some random links here. Anything from your YT channel to a random meme.", 
        "Pure emptiness...just the void.....so empty. You should add something here.", 
        "https://cdn.discordapp.com/attachments/930396635773681664/992032156362735636/b99_cast.jpg"];
      if(res.result == false) return msg.channel.send(res.reason)
      const GenInfo = res.data;
      let ConfigUpdate = {};
      switch(type) {
        case "bio":
          console.log("hiii")
          ConfigUpdate = { $set: { bio: "Your bio....It's lookin' a little empty..." } };
        break;
          
        case "words":
          msg.channel.send({ components: [menu(type, GenInfo.words)] })
        break;
          
        case "links":
          msg.channel.send({ components: [menu(type, GenInfo.links)] })
        break;

        case "image":
          ConfigUpdate = { $set: { image: "https://cdn.discordapp.com/attachments/930396635773681664/992032156362735636/b99_cast.jpg" } };
        break;
          
        default:
          return msg.channel.send("[BioRemove Normal] Type (arg 1) is not valid. Type must be one of: `bio`, `image`, `words`, or `links`. ");
        break;
      }

      if(["links", "words"].includes(type) == false) {
        updateDB(GenInfo, uri, msg.channel, msg.author.id, type, ConfigUpdate).then(res => {
          if(res == true)
            msg.channel.send("Bio page updated successfully. If this is not the case, try again. If this issue persists, please notify a bot developer.");
          else msg.channel.send("Error while updating bio DB. Try again. If this issue persists, please notify a bot developer.");
        });
      }
    });
  },
};

function menu(type, stuff) {
  const options = [];
  for(let i = 0; i < stuff.length; i++) {
    options.push({
      label: stuff[i],
      value: type + "-" + String(i)
    });
  }
  return new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageSelectMenu()
        .setCustomId("bio-remove-menu")
        .setPlaceholder("Nothing selected")
        .addOptions(options)
    );
}
