module.exports = {
	name: 'suggesttopic',
	description: 'Suggest a topic for the `>topic` command.',
	execute(msg, args, chnl) {
    let Bug = "";
    if(!args.length) return msg.channel.send("Hey Hitchcock you gotta mention the topic before submitting it smh. Correct usage: `>suggesttopic [topic]`.");
    for(let i = 0; i < args.length; i++) { //Gets message from the argument and puts in string.
      Bug = Bug + " " + args[i];
    }
    //Sending issue string 
    try {
      chnl.send("<@397773303965548544>, new TOPIC Suggestion:\nFrom: <@" + msg.author.id + ">\nTopic: " + Bug);
      msg.channel.send("Your quote has been submitted!");
    } catch(e) {
      msg.channel.send("Unable to send topic due to an internal error (or Discord fucked up). - Check console for error.");
      console.log("Command: suggesttopic\nError: " + e);
    }
  },
};