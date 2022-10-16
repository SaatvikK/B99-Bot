// All Functions in this module are used for the `bioremove` function. Used in bioremove.js and index.js.

const MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');

// Function used to get the GeneralInfo (bio, images, links, words) from the Atlas Server.
const getInfo = async (uri, channel, AuthorID) => {
	const mongo = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
  
	try {
		await mongo.connect();
		const collection = await mongo.db("YouPersonal").collection("GeneralInfo");
		const data = await collection.find({ UserID: AuthorID }).toArray(); // Finding the GeneralInfo of the user and parsing it into an array.
    if(data != null || data != undefined)
      return { result: true, data: data[0] }; // Return the data.
    else return { result: false, reason: "Your bio page has not been set up. Use the `>bio create` command." };
	} catch(e) {
		channel.send("Error while gettng bio data.");
		console.log("Error while gettng bio data:\n ");
    console.log(e)
    return { result: false, reason: "Error while getting bio data.", error: e };
	} finally { mongo.close(); }     
}


// Function used to update the GeneralInfo (bio, links, words, images).
const updateDatabase = async (info, uri, channel, AuthorID, type, UpdateDoc) => {
	if(Object.keys(UpdateDoc).length === 0) return;
	const mongo = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	
	try {
		await mongo.connect();
		const collection = await mongo.db("YouPersonal").collection("GeneralInfo");
		const options = { upsert: true } // Create a document if no document already exists.
		const result = await collection.updateOne({ UserID: AuthorID }, UpdateDoc, options);
		return true;
	} catch(e) {
		channel.send("Error while updating bio data.");
		console.log("Error while updating bio data:\n " + e);
		console.log(e)
		return false;
	} finally { mongo.close(); }    
}

module.exports = {
	getGenInfo: getInfo,
	updateDB: updateDatabase
};
