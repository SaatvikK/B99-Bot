const MongoClient = require('mongodb').MongoClient;
module.exports = {
	name: 'triviadrop',
	description: 'Resets the trivia database.',
	execute(msg, args, client, uri) {
    async function dropDB(msg, args, client, uri) {
      console.log("async fcuntion")
      const database = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      try {
        await database.connect();
        const TriviaCollection = await database.db("BrooklynNineNine").collection("B99");
        TriviaCollection.drop(function(err, delOK) {
          if (err) {
            msg.channel.send("Could not reset trivia, try again or contact developer.");
            msg.channel.send(err)
            throw err;
          }
          if (delOK) console.log("Collection deleted"); msg.channel.send("Trivia reset [collection dropped].");
        });   
      } catch(e) {
        msg.channel.send("Error while adding point. Full error in console.");
        console.log("Error while adding trivia points via addtrivia:");
        console.log(e);
      } finally { database.close(); }
    }
    dropDB(msg, args, client, uri)
  },
};

