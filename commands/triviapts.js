const MongoClient = require('mongodb').MongoClient;
module.exports = {
	name: 'triviapts',
	description: 'Displays your total trivia points.',
	execute(msg, args, typicalEmbed, colour, footer, uri) {
		async function queryDB(uri) {
      console.log("async fcuntion")
      const database = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      try {
        await database.connect();
        const TriviaCollection = await database.db("BrooklynNineNine").collection("B99");
        const sort = { length: -1 };

        const result = await TriviaCollection.findOne({"UserID":args[0] || msg.author.id});
        return result;      
      } catch(e) {
        msg.channel.send("Error while adding point. Full error in console.");
        console.log("Error while adding trivia points via addtrivia:");
        console.log(e);
      } finally { database.close(); } 

    }
    queryDB(uri).catch(console.dir).then(result => {
      if(result != null) {
        const desc = "<@" + result["UserID"] + "> has **" + result["TriviaPoints"] + "** trivia point(s)!";
        msg.channel.send({
          embeds: [{
            "title": "Trivia Points: ",
            "description": desc,
            "color": colour,
            "timestamp": new Date(),
            "footer": {
              text: footer
            }
          }]
        });

        return; 
      } else {
        const user = args[0] || msg.author.id;
        const desc = "<@" + user + "> has **0** trivia point(s)!";
        msg.channel.send({
          embeds: [{
            "title": "Trivia Points: ",
            "description": desc,
            "color": colour,
            "timestamp": new Date(),
            "footer": {
              text: footer
            }
          }]
        });

        return;            
      }
    });
  },
};

