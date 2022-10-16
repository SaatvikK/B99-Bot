const MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');
const fs = require('fs')
module.exports = {
  name: 'holtgame',
  description: "**Real Ray or Fake Ray?** The game that the Squad played at Boyle's beach party!",
  execute(msg, args, colour, footer, command, quotes) {
    // Only works in #meep-morp-zeep.
    if (msg.channel.id === "761142574416789524") {
      // Retrieving data.
      const questiondata = JSON.parse(fs.readFileSync("./ray-db.json", "utf8"));
      // Cooldowns and 15 Second Timer - reacts with emoji if it hasn't been 1 minute since the last question was asked.
      if (questiondata.expired === false) {
        msg.react('⏳')
      } else {
        if (questiondata.timer === false) {
          msg.react('⏳')
        } else {
          // Embed Gifs.
          let yay = [
            "https://media.discordapp.net/attachments/930396635773681664/984767210935431209/IMG_3174.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767211220639744/IMG_3173.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767211703005234/IMG_3172.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984767212130795561/IMG_3171.gif"
          ]
          let bad = [
            "https://media.discordapp.net/attachments/930396635773681664/984769154961768519/IMG_3175.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984769167288860682/IMG_3176.gif",
            "https://media.discordapp.net/attachments/930396635773681664/984769221055635496/IMG_3178.webp",
          ]
          // Selecting random gif.
          let yayGif = yay[Math.floor(Math.random() * yay.length)];
          let sadGif = bad[Math.floor(Math.random() * bad.length)];
          // Choosing quote.
          let quote = quotes[Math.floor(Math.random() * quotes.length)]
          if (quotes.length < 1) return msg.channel.send("There are no quotes that I can ask you! Suggest some with `>suggestquotes [your quote here]`!");
          let foot = `Suggest more quotes with the >suggestquote command! | Question ${quote._id}; User: ${msg.author.id}`
          // Send message with question and buttons.
          msg.channel.send({
            embeds: [{
              color: colour,
              title: "Real Ray or Fake Ray?",
              thumbnail: {
                url: msg.guild.iconURL()
              },
              description: "**Question:** " + quote["Quote"],
              timestamp: new Date(),
              footer: {
                text: foot,
              }
            }],
            components: [
              {
                type: 1,
                components: [
                  {
                    style: 1,
                    label: `Real Ray`,
                    custom_id: "real",
                    disabled: false,
                    type: 2
                  },
                  {
                    style: 1,
                    label: `Fake Ray`,
                    custom_id: "fake",
                    disabled: false,
                    type: 2
                  }
                ]
              }
            ]
          }).then(message => {
            // Update the ./ray-db.json file. Records the quote, whether the answer is correct, the user, etc.
            fs.writeFileSync("./ray-db.json", JSON.stringify({
              user: msg.author.id,
              message: msg.id,
              quote: quote["Quote"],
              answer: quote["Answer"],
              questionId: quote["_id"],
              expired: false,
              timer: false
            }));
            // Sets the timer and cooldown
            setTimeout(() => {
              msg.channel.messages.fetch(message.id).then(get => {
                // Checks if message has been edited after 15 seconds.
                if (get.embeds[0].title === "WHY?!" || get.embeds[0].title === "Bingpot!") {
                } else {
                  console.log("15 second timer.")
                  // Edit message if the question hasn't been answered.
                  get.edit({
                    embeds: [
                      {
                        color: colour,
                        title: `That's gonna leave a mark.`,
                        description: `<@!${msg.author.id}>! Be faster next time! The 15 second timer went off and you didn't answer! The correct option was **${quote.Answer}**.`,
                        thumbnail: {
                          url: sadGif
                        }
                      }
                    ],
                    components: []
                  });
                  // Set the expired value to true.
                  fs.writeFileSync("./ray-db.json", JSON.stringify({
                    user: msg.author.id,
                    message: msg.id,
                    quote: quote["Quote"],
                    answer: quote["Answer"],
                    questionId: quote["_id"],
                    expired: true,
                    timer: false
                  }));
                };
              });
            }, "15000")
            setTimeout(() => {
              // 1 minute timer.
              // Set the timer value to true, letting people use the command again.
              fs.writeFileSync("./ray-db.json", JSON.stringify({
                user: msg.author.id,
                message: msg.id,
                quote: quote["Quote"],
                answer: quote["Answer"],
                questionId: quote["_id"],
                expired: true,
                timer: true
              }));
            }, "60000")
          });
        }
      }
    }
  },
};
