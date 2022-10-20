//On interaction event (e.g Buttons) ------------------------------
client.on('interactionCreate', interaction => {
  if(interaction.isButton()) {
    if(interaction.customId === "real" || interaction.customId === "fake") {
      // If the button is either a "Real Ray" or "Fake Ray" button.
      // Get data from JSON.
      const questiondata = JSON.parse(fs.readFileSync("./ray-db.json", "utf8"))
      let answer = questiondata["answer"].toLowerCase();
      let user = questiondata["user"];
      if(interaction.user.id === user) {
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
          let PrevPoints = null;
          // No user in DB - 0 points.
          if (!FindRayUser) PrevPoints = 0;
          else PrevPoints = FindRayUser.Points;

          //----- GIFS -----\\ 
          let yay = [
            "https://media.discordapp.net/attachments/930396635773681664/984767210935431209/IMG_3174.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767211220639744/IMG_3173.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767211703005234/IMG_3172.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767212130795561/IMG_3171.gif"
          ];
          let bad = [
            "https://media.discordapp.net/attachments/930396635773681664/984769154961768519/IMG_3175.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984769167288860682/IMG_3176.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984769221055635496/IMG_3178.webp",
          ];
          // Selecting a random gif.
          let yayGif = yay[Math.floor(Math.random() * yay.length)];
          let sadGif = bad[Math.floor(Math.random() * bad.length)];
          if(interaction.customId == answer) { // If answer is correct
            let msg = interaction.message;
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

            // Update the user's points in mongo db (PrevPoints + 1). If they aren't found in the database, a document will be created with the values given (this is the "upsert" value). If they are found, the document's data will be updated.
            await RayPointsCollection.findOneAndUpdate({ "UserID": user }, { $set: { "UserID": user, "Points": parseInt(PrevPoints) + 1 } }, { upsert: true });
          } else { // Answer incorrect
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
          }
          // Write JSON. Set expired to true when button is clicked.
          fs.writeFileSync("./jsons/ray-db.json", JSON.stringify({
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
  } else if(interaction.isSelectMenu() == true) {
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
