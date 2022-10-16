const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

module.exports = {
	name: 'remtopic',
	description: 'Staff only! Adds topic to database.',
	execute(msg, args, uri, logging, command) {
    async function remQuote(msg, uri, topic) {
      console.log("async fcuntion")
      const database = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      try {
        await database.connect();
        const collection = await database.db("BrooklynNineNine").collection("topics");
        const sort = { length: -1 };
    
        const FindQuote = await collection.findOne({"topic": topic});
        if(FindQuote != null) {
          const InsertDoc = await collection.deleteOne({"topic": topic});
          msg.channel.send("Topic removed.");
          const TopicsCollection = await database.db("BrooklynNineNine").collection("topics");
          fs.writeFile("../JSONs/topics.json", JSON.stringify(await TopicsCollection.find({}).toArray()), function(err) {

          });
        } else { msg.channel.send("Topic not in database."); return; }
    
        
      } catch(e) { msg.channel.send("Encountered an error while removing topic from DB."); }
      finally { database.close(); }
    }

    remQuote(msg, uri, args.join(" "));
  },
};