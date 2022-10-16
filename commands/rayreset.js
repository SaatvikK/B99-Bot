const MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');
const fs = require('fs')
module.exports = {
  name: 'rayreset',
  description: "Resets the >holtgame command when something fails (mostly the cooldown).",
  execute(msg, args, typicalEmbed, colour, footer, uri) {
    try {
      // Read JSON.
      const questiondata = JSON.parse(fs.readFileSync("./ray-db.json", "utf8"));
      // Write JSON. Set both the timers off allowing the command to be used again.
      fs.writeFileSync("./ray-db.json", JSON.stringify({
        user: questiondata["user"],
        message: questiondata["message"],
        quote: questiondata["quote"],
        answer: questiondata["answer"],
        questionId: questiondata["questionId"],
        expired: true,
        timer: true
      }));
      msg.channel.send("Reset the \`>holtgame\` command successfully.")
    } catch (e) {
      msg.channel.send("Something went wrong when I was trying to reset the \`>holtgame\` command.")
    }
  }
}