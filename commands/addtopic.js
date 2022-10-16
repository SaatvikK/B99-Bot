const MongoClient = require('mongodb').MongoClient;
module.exports = {
	name: 'addtopic',
	description: 'Staff only! Adds a topic to DB.',
	execute(msg, args, uri, logging, command) {
    async function addQuote(msg, topic, uri, logging, command) {
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
        if(FindQuote == null) {
          const InsertDoc = await collection.insertOne({"topic": topic});
          msg.channel.send("Topic added to database.");
          return;
        } else { msg.channel.send("Topic already exists in database."); return; }
    
        
      } catch(e) { msg.channel.send("Encountered an error adding topic to DB."); }
      finally { database.close(); }
    }

    addQuote(msg, args.join(" "), uri);
  },
};
