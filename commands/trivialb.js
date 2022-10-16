const MongoClient = require('mongodb').MongoClient;
module.exports = {
	name: 'trivialb',
	description: 'Displays the top 10 trivia people.',
	execute(msg, args, typicalEmbed, colour, footer, uri) {
		const TriviaPoints = [];
		const UserID = [];
		const lbPlacements = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];


		queryDB(uri, msg).catch(console.dir).then(data => {
			for(let i = 0; i < data.length; i++) {
				TriviaPoints.push(parseInt(data[i]["TriviaPoints"]));
				UserID.push(data[i]["UserID"]);
			}
			
			//Bubble sorting both arrays.
			let len = TriviaPoints.length;
			for(let i = 0; i < len; i++) {
				for(let j = 0; j < len; j++) {
					if(TriviaPoints[j] < TriviaPoints[j + 1]) {
						let tmp = TriviaPoints[j];
						let tmpUser = UserID[j];
						TriviaPoints[j] = TriviaPoints[j + 1];
						UserID[j] = UserID[j + 1];
						TriviaPoints[j + 1] = tmp;
						UserID[j + 1] = tmpUser;
					}
				}
			}
	
			let desc = "";
			for(let i = 0; i < lbPlacements.length; i++) {
				if(UserID[i] != null) {
					if(TriviaPoints[i] != null) {
						let ThisRank = lbPlacements[i] + " | <@" + UserID[i] + "> | " + TriviaPoints[i] + " points.\n";
						desc = desc + ThisRank;
					} else {
						let ThisRank = lbPlacements[i] + " | <@" + UserID[i] + "> | 0 points.\n";
						desc = desc + ThisRank;
					}
				} else {
					if(TriviaPoints[i] != null) {
						let ThisRank = lbPlacements[i] + " | No user | " + TriviaPoints[i] + " points.\n";
						desc = desc + ThisRank;	
					} else {
						let ThisRank = lbPlacements[i] + " | No user | 0 points.\n";
						desc = desc + ThisRank;					
					}
				}
			}
			
			msg.channel.send({
				embeds: [{
					"title": "Trivia Leaderboard",
					"description": desc,
					"color": colour,
					"timestamp": new Date(),
					"footer": {
						text: footer
					}
				}]
			});
		});

  },
};

//Getting the DB as an array.
async function queryDB(uri, msg) {
	console.log("async fcuntion")
	const database = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	try {
		await database.connect();
		const TriviaCollection = await database.db("BrooklynNineNine").collection("B99");
		const data = await TriviaCollection.find({}).toArray();
		return data;
	} catch(e) {
		msg.channel.send("Error while sorting trivia lb into correct order. Full error in console.");
		console.log("Error while sorting trivia lb into correct order:\n " + e);
	} finally { database.close(); } 

}