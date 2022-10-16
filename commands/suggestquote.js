module.exports = {
	name: 'suggestquote',
	description: 'Suggest a quote for the Real Ray or Fake Ray/Holt Game',
	execute(msg, args, chnl) {
    let Bug = "";
    if(!args.length) return msg.channel.send("Hey Hitchcock you gotta mention the quote before submitting it smh. Correct usage: `>suggestquote [quote]`.");
    for(let i = 0; i < args.length; i++) { //Gets message from the argument and puts in string.
      Bug = Bug + " " + args[i];
    }
    //Sending issue string 
    try {
      chnl.send("<@!745449033304244314>, new QUOTE Suggestion:\nFrom: <@" + msg.author.id + ">\nQuote: " + Bug);
      msg.channel.send("Your quote has been submitted!");
    } catch(e) {
      msg.channel.send("Unable to send quote due to an internal error (or Discord fucked up). - Check console for error.");
      console.log("Command: suggestquote\nError: " + e);
    }
  },
};