const MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');
const fs = require('fs')
module.exports = {
  name: 'ahgwinner',
  description: "Mods only! Adds a user to the AH/G database to be viewed on `>you`. Also adds the AH/G role to the user provided.",
  execute(msg, args, typicalEmbed, colour, footer, uri) {
    (async function() {
      if (
        msg.member.roles.cache.has("535155142870433841") == true ||          msg.member.roles.cache.has("938012155293335602") == true ||    msg.member.roles.cache.has("535152953862914058") == true){
      try {
        if (args[0], args[1], args[2]) { // If all required fields are given.

          let idCheck = parseInt(args[0])
          let isNumberId = Number.isInteger(idCheck)
          let UserID = args[0]
          let Month = args[1].toLowerCase()
          let yearCheck = parseInt(args[2])
          let isNumberYear = Number.isInteger(yearCheck)
          let Year = args[2]
          // Defining stuff & checking if the year and the User ID given are valid numbers.

          let syntax = `\`>ahgwinner <UserID:Number> <Month:FullWord> <Year:Number>\`` // Command syntax.

          if (isNumberId) { } else {
            msg.channel.send(`Hey Hitchcock! It looks like you've given me an invalid User ID. The correct syntax is ${syntax}.`)
            return;
          } // If the User ID given is not a valid number, send the error message.
          if (Month === 'january' || Month === 'february' || Month === 'march' || Month === 'april' || Month === 'may' || Month === 'june' || Month === 'july' || Month === 'august' || Month === 'september' || Month === 'october' || Month === 'november' || Month === 'december') { } else {
            msg.channel.send(`Hey Hitchcock! It looks like you've given me an invalid month. The correct syntax is ${syntax}.`)
            return;
          } // If the month given is not a valid month, send the error message.
          if (isNumberYear) { } else {
            msg.channel.send(`Hey Hitchcock! It looks like you've given me an invalid year. The correct syntax is ${syntax}.`)
            return;
          } // If the year given is not a valid number, send the error message.
          const database = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          await database.connect();
          const collection = await database.db("YouPersonal").collection("AHGWinners");
          // Mongo Stuff
          const FindUser = await collection.findOne({ "UserID": UserID }); // Try to find a user in the database.
          if (FindUser == null) { // If no user is found, insert a document.
            const InsertDoc = await collection.insertOne({ "UserID": UserID, "DateWon": { "month": Month, "year": Year } });
            msg.channel.send("Successfully added the user to the AH/G Database.");

          } else { msg.channel.send("Looks like this user has already been given AH/G. In fact, they were awarded it " + FindUser.DateWon.month + " " + FindUser.DateWon.year + ".") } // If a user is found, send error message.
        } else { msg.channel.send("Oy Hitchcock! Fill out all of the required fields. The syntax is: `>ahgwinner <UserID:Number> <Month:FullWord> <Year:Number>\`.") }
      } catch (e) {
        console.log(e)
       }
     } else { msg.channel.send("You can't do that!") }
    }());
  }
}