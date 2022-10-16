const MongoClient = require('mongodb').MongoClient;
module.exports = {
	name: 'remrayquote',
	description: 'Staff only! Adds another quote to `>holtgame`.',
	execute(msg, args, colour, footer, uri, logging, command) {
    async function remQuote(uri, quote) {
      console.log("async fcuntion")
      const database = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      try {
        await database.connect();
        const collection = await database.db("BrooklynNineNine").collection("RayQuotes");
        const sort = { length: -1 };
    
        const FindQuote = await collection.findOne({"Quote": quote});
        if(FindQuote != null) {
          const InsertDoc = await collection.deleteOne({"Quote": quote});
          msg.channel.send("Quote removed from game database.");
          return;
        } else { msg.channel.send("Quote not in DataBase."); return; }
    
        
      } catch(e) { msg.channel.send("Encountered an error getting quotes from DB."); }
      finally { database.close(); }
    }

    remQuote(uri, args.join(" "));
  },
};