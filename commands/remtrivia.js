const MongoClient = require('mongodb').MongoClient;
module.exports = {
	name: 'remtrivia',
	description: 'Staff only! Remove trivia points from a certain user.',
	execute(msg, args, typicalEmbed, colour, footer, fs, uri, command) {
    //arg[1] - amount to give.
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

        const result = await TriviaCollection.findOne({"UserID":args[0]});
        console.log(result);

        if(result != null && result["TriviaPoints"] != 0) {
          const MyQuery = {"UserID":args[0]};
          const NewQuery = { $set: {"UserID": result["UserID"],"TriviaPoints": result["TriviaPoints"] - parseInt(args[1])} };
          const res = await TriviaCollection.updateOne(MyQuery, NewQuery);
          msg.channel.send("Removed points.");
          return;            
        } else if(result["TriviaPoints"] == 0) { msg.channel.send("That user has 0 trivia points already."); } else {
          const doc = {"UserID": args[0],"TriviaPoints":parseInt(0)};
          const InsertDoc = await TriviaCollection.insertOne(doc);
          msg.channel.send("Created record for this user with 0 points.");
          return;    
        }    
      } catch(e) {
        msg.channel.send("Error while adding point. Full error in console.");
      } finally { database.close(); } 

    }
    queryDB(uri);
  },
};
