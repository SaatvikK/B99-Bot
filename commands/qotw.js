const talkedRecently = new Set();
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'qotw',
	description: 'Creates a new QOTW thread. Staff only.',
	async execute(msg, args, client, colour, footer) {
    if(talkedRecently.has(msg.author.id)) return msg.channel.send("You're on a 2 minute cooldown, Hitchcock.");
    if(!args.length) return msg.channel.send("You need to provide a QOTW, Hitchcock.");
    const qotw = args.join(" ");

    console.log(colour)
    await msg.channel.send({
      embeds: [{
        "title": "QOTW Thread: **__" + new Date() + "__**",
        "description": qotw,
        "color": colour,
        "timestamp": new Date(),
        "footer": {
          text: footer
        }
      }]
    });

    await msg.channel.send("<@&929722586076696666> ^^^");

    const thread = await client.channels.cache.get("767667305902637057").threads.create({
      name: qotw,
      autoArchiveDuration: 60,
      reason: qotw
    });
    // Adds the user to the set so that they can't talk for a minute
    talkedRecently.add(msg.author.id);
    setTimeout(() => {
        // Removes the user from the set after a minute
      talkedRecently.delete(msg.author.id);
    }, 120000);
	},
};