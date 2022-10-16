module.exports = {
	name: 'topic',
	description: 'Gives you a random topic.',
	execute(msg, command, topics, colour) {
    try {
      console.log("ONE")
      if(topics.length < 1) {
        return msg.channel.send("There are no topics that I can ask you! Suggest some with `>suggesttopic [your topic here]`!");
      } else {
        msg.channel.send({
          embeds: [{
            "description": topics[Math.floor(Math.random() * topics.length)]["topic"],
            "color": colour
          }]
        });
      } 
    } catch(e) {
      msg.channel.send("Some sort of weird error has occurred. Check logs.");
      console.log(e);
    }
  },
};
