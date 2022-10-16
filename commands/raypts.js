const MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');
const fs = require('fs')
module.exports = {
  name: 'raypts',
  description: "Return a users ray points, which are earned via the >holtgame command!",
  execute(msg, args, typicalEmbed, user, colour, footer, uri) {
    (async function() {
      // Mongo Stuff
      const database = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await database.connect();
      const RayPointsCollection = await database.db("BrooklynNineNine").collection("RayPoints");
      const sort = { length: -1 };
      // Get user's ray points. If there is no ID not mentioned in message, use the message author.
      const result = await RayPointsCollection.findOne({ "UserID": args[0] || msg.author.id });
      if (result === undefined) {
        // If no user is found in the database, send this message.
        msg.channel.send({
          embeds: [{
            color: colour,
            title: `${user.username}’s Ray Points`,
            thumbnail: {
              url: msg.guild.iconURL()
            },
            description: `<@!${user.id}> has \`0\` Ray points.`,
            timestamp: new Date(),
            footer: {
              text: "Play >holtgame to earn yourself some ray points!",
            }
          }]
        });
      } else {
        // If a user is found in the database, return their ray points in the message.
        msg.channel.send({
          embeds: [{
            color: colour,
            title: `${user.username}’s Ray Points`,
            thumbnail: {
              url: msg.guild.iconURL()
            },
            description: `<@!${user.id}> has \`${result.Points}\` Ray points.`,
            timestamp: new Date(),
            footer: {
              text: "Play >holtgame to earn yourself some ray points!",
            }
          }]
        });
      }
    }());
  }
}