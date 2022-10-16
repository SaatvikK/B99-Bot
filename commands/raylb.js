const MongoClient = require('mongodb').MongoClient;
module.exports = {
  name: 'raylb',
  description: 'Returns the 10 users with the most Ray points.',
  execute(msg, args, typicalEmbed, colour, footer, uri) {
    const RayPoints = [];
    const UserID = [];
    const lbPlacements = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];


    queryDB(uri, msg).catch(console.dir).then(data => {
      for (let i = 0; i < data.length; i++) {
        RayPoints.push(parseInt(data[i]["Points"]));
        UserID.push(data[i]["UserID"]);
      }
      //Bubble sorting both arrays.
      let len = RayPoints.length;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
          if (RayPoints[j] < RayPoints[j + 1]) {
            let tmp = RayPoints[j];
            let tmpUser = UserID[j];
            RayPoints[j] = RayPoints[j + 1];
            UserID[j] = UserID[j + 1];
            RayPoints[j + 1] = tmp;
            UserID[j + 1] = tmpUser;
          }
        }
      }

      let desc = "";
      for (let i = 0; i < lbPlacements.length; i++) {
        if (UserID[i] != null) {
          if (RayPoints[i] != null) {
            let ThisRank = lbPlacements[i] + " | <@!" + UserID[i] + "> | " + RayPoints[i] + " points.\n";
            desc = desc + ThisRank;
          } else {
            let ThisRank = lbPlacements[i] + " | <@!" + UserID[i] + "> | 0 points.\n";
            desc = desc + ThisRank;
          }
        } else {
          if (RayPoints[i] != null) {
            let ThisRank = lbPlacements[i] + " | No user | " + RayPoints[i] + " points.\n";
            desc = desc + ThisRank;
          } else {
            let ThisRank = lbPlacements[i] + " | No user | 0 points.\n";
            desc = desc + ThisRank;
          }
        }
      }

      msg.channel.send({
        embeds: [{
          "title": "Ray Points Leaderboard",
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
    const RayPointsCollection = await database.db("BrooklynNineNine").collection("RayPoints");
    const data = await RayPointsCollection.find({}).toArray();
    return data;
  } catch (e) {
    msg.channel.send("Error while sorting Ray points lb into correct order. Full error in console.");
    console.log("Error while sorting Ray points lb into correct order:\n " + e);
  } finally { database.close(); }

}