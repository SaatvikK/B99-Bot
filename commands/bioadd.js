const MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');
const fs = require('fs');
const getGenInfo = require("../GlobalFuncs/BioRemoveFuncs").getGenInfo;
const updateDB = require("../GlobalFuncs/BioRemoveFuncs").updateDB;

module.exports = {
	name: 'bioadd',
	description: "Add S T U F F to your bio page!",
	execute(msg, args, colour, footer, command, client, uri, MsgWithCaps, prefix) {
    if(!args.length) return msg.channel.send("Incorrect arguments. Correct usage: `>bioadd [bio/words/links/image] [text]`. Example: `>bioadd bio Hello my name is ducky` or `>bioadd words 'some inspirational words' - some guy`");
    const ArgsCaps = MsgWithCaps.content.slice(prefix.length).trim().split(/ +/);
    const CommandCaps = ArgsCaps.shift().toLowerCase();
    const type = args[0];
    args.shift(); ArgsCaps.shift();
    const text = ArgsCaps.join(" ");
    const IsValid = validityCheck(text, type);
    if(IsValid.result == false) return msg.channel.send(IsValid.reason)
    getGenInfo(uri, msg.channel, msg.author.id).then(res => {
      if(res.result == false) return msg.channel.send(res.reason)
      const GenInfo = res.data;
      let ConfigUpdate = {};
      switch(type) {
        case "bio":
          ConfigUpdate = { $set: { bio: text } };
        break;
          
        case "words":
          if(GenInfo.words[0] == "Pure emptiness...just the void.....so empty. You should add something here.") GenInfo.words.shift();
          GenInfo.words.push(text);
          ConfigUpdate = { $set: { words: GenInfo.words } };
        break;
          
        case "links":
          if(GenInfo.links[0] == "You can just put some random links here. Anything from your YT channel to a random meme.") GenInfo.links.shift()
          GenInfo.links.push(text);
          ConfigUpdate = { $set: { links: GenInfo.links } };
        break;

        case "image":
          ConfigUpdate = { $set: { image: ArgsCaps[0] } };
        break;
          
        default:
          return msg.channel.send("Type (arg 1) is not valid. Type must be one of: `bio`, `image`, `words`, or `links`. ");
        break;
      }

      updateDB(GenInfo, uri, msg.channel, msg.author.id, type, ConfigUpdate).then(() => {
        msg.channel.send("Bio page updated successfully. If this is not the case, try again. If this issue persists, please notify a bot developer.");
      });
    });
  },
};

function validityCheck(text, type) {
  if(type == "image" || type == "links") {
    if(text.includes(" ") == true) {
      return { result: false, reason: "Error at arg 2: Incorrect usage of `image` or `links` types (link must not contain spaces)." };
    }
  }

  return { result: true };
}