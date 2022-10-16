const MongoClient = require('mongodb').MongoClient;
module.exports = {
	name: 'addrayquote',
	description: 'Staff only! Adds another quote to `>holtgame`.',
	execute(msg, args, colour, argsAnswer, footer, uri, logging, command) {
    async function addQuote(uri, quote) {
      console.log("async fcuntion")
      const database = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      try {
        await database.connect();
        const collection = await database.db("BrooklynNineNine").collection("RayQuotes");
        const sort = { length: -1 };
        let answer = ""
        // Changes argsAnswer to the correct capitalisation and redefines answer.
        if (argsAnswer === `real`){ answer = "Real"} else if (argsAnswer === `fake`){ answer = "Fake"}
        quote = quote.slice(5); // Alters the string to ignore the "Fake " and "Real " part of the message. 5 represents the fifth index where the string is sliced.
        const FindQuote = await collection.findOne({"Quote": quote});
        if(FindQuote == null) {
          const InsertDoc = await collection.insertOne({"Quote": quote, "Answer": answer});
          msg.channel.send("Quote added to game database.");
          return;
        } else { msg.channel.send("Quote already exists in Data Base."); return; }
    
        
      } catch(e) { msg.channel.send("Encountered an error getting quotes from DB."); }
      finally { database.close(); }
    }

    addQuote(uri, args.join(" "));
  },
};