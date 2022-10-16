module.exports = {
	name: 'rules',
	description: 'Displays the server rules [staff only].',
	execute(msg, args, colour, footer) {
    console.log("haiaiaiaiaiai")
    msg.delete();
    const content = [
      {
        header: "Hey fellow detective! These are the precinct rules",
        content:
          "Rule 1:  **Treat everyone with respect. Harassment,sexism,racism and hate speech wont be tolerated.**" +
          "\n\nRule 2:  **No Doxxing**. Doxxing won't be tolerated and will result in a ban." +
          "\n\nRule 3:   **Don't spam ping people/spamming in chat or chat flood**" +
          "\n\nRule 4:  **Respect moderator actions. However if u think u were muted/kicked without a good reason, u can appeal to us**" +
          "\n\nRule 5:  **No Vulgarity**. moderate amount of vulgarity is allowed but when directed towards others you might be muted and warned and in some cases even in a ban, punishment will be given by the seriousness of the situation" +
          "\n\nRule 6:  **NO NSFW** other than references to the show" + 
          "\n\nRule 7:  While Swearing is allowed, **NO OFFENSIVE WORDS LIKE THE N WORD C--T ETC.**" +
          "\n\nRule 8:  **Linking Any harmful material (scam links,virus,ip grabbers etc) will result in a INSTANT BAN**" +
          "\n\nRule 9:   **Keep spoilers about the show in the discussion channel #b99-discussion. In that channel you can freely talk about the show.**" +
          "\n\nRule 10:   *NO ADVERTISING*, We do partnerships for which u can contact mods about it" +
          "\n\nRule 11: *Avoid Politics and Religious discussions* .These topics are usually too controversial and lead to toxic arguments pretty quick so don't go too far and know when to stop :HoltHuffy:." +
          "\n\nRule 12: **DO NOT CAUSE DRAMA**, do not provoke or create a huge drama" +
          "\n\n\nIt is not practically possible for us to name every single infraction in a limited set of rules, so we request you to use common sense and discern what's right and wrong, and just when you should stop if someone feels like you're going over the line." +
          "\n\n\nNote: Punishment will be decided by mods",
        image: "https://cdn.discordapp.com/attachments/930396635773681664/941988490143473714/IMG_3557.jpg"
      },

      {
        header: "INFO ABOUT ROLES",
        content:
          "**Staff**" + 
          "\n<@&535152953862914058> - Owners of the server  They are: CallMeMike and turtlemansam. " +
          "\n<@&535155142870433841> - Senior moderators (moderates the server and helps the owner manage the server)." +
          "\n<@&781831949965983784> - Subreddit mods" +


          "\n\n**Special roles**" +

          "\n<@&704306860219695153>  - for people who boost the server" +

          "\n\<@&770046587376107536>  - Given for one month by staff to someone who has contributed a lot to the server" +

          "\n<@&796377773799243776>  - They plan and host every event." +

          "\n\n**XP ROLES**" +

          "\nDo -rr view in <#761142574416789524> to get a list of xp roles" +
          "\nDo -rank in <#761142574416789524> to get your current rank." +
          "\nDo -lb in <#761142574416789524> to get the leaderboard." +

          "\n\nIt works like this: You get a 15-25 xp points if u chat every minute. If u get enough XP you get a new level. **Every 5 levels, you get a new role!, Exciting,right?**" +

          "\n\n**Opt in roles**" +

          "\nTake a look at <#762081684870660176>  for all opt in roles"
      },

      {
        header: "Help the Staff Team",
        content: "if you see anyone breaking the rules PLEASE:-" +
                "\n\n-ping <@&535155142870433841> or <@&535152953862914058>. Please only do this if it is urgent such as raid , spamming inappropriate pictures etc" +
                "\n\nAND/OR" +
                "\n\n-use the command '?report'. Example:- ?report Help! There’s someone sending malicious links in nap room",
        image: "https://cdn.discordapp.com/attachments/930396635773681664/934005828573339708/IMG_3562.webp"
      },

      {
        header: "INFO ABOUT EVENTS",
        content: 
          "**Rewatches**" +
          "\n*On every Friday we rewatch an episode of  b99, a staff member streams it on vc and we just sit watch and discuss about it*. To get notified about Rewatch opt the events role in <#762081684870660176>" +

          "\n\n**Trivia**" +
          "\n*Every week on a random day  a event host comes prepared with trivia and asks the questions, getting a question right gives u a point, u can check trivia points in <#761142574416789524> use command >trivialb . Whoever has the most points in a month gets the Server member of the month role!. Opt the Trivia role in <#762081684870660176> to get notified about Trivia.* Trivia happens in <#760258600983199764>" +

          "\n\n**QOTD**" +
          "\n*Every day we ask a B99 Related question in <#767667305902637057> and discuss over it. To get notified about QOTD opt the role QOTD in <#762081684870660176>*" +

          "\n\n**CAH/Cards Against Humanity**" +
          "\n*Cards Against Humanity is an party game in which players complete fill-in-the-blank statements using words or phrases typically funny. Overall it's a fun game and makes everyone on the server competitive*"
      },

      {
        header: "FAQs",
        content:
          "Q.1 **Where can I watch s8?**" +
          "\nA. Oh Istg  we've been asked this so much! anyways, u can watch s8 on SBS. COM using a vpn (Australia location), u can buy it on YouTube or just wait for it come one Netflix in your region." +

          "\n\nQ.2 **Is this official NBC Brooklyn Nine Nine-Nine Discord server?**" +
          "\nA. No it isn't , we are the official **r/Brooklyn Nine Nine discord Server NOT the official b99 discord server. we are the best though I'd give u that" +

          "\n\nQ.3  **How do I get roles?**" +
          "\nA. Just go to #roles-selection and pick some roles.You get the xp roles by being active in chat." +

          "\n\nQ.4 **is @Call Me Mike#9339  Mike schur?**" +
          "\nA. We don't know , but we are 99.9% sure he is" +

          "\n\nQ.5 **Do people even ask us these?**" +
          "\nA.  except the first question, no",
        image: "https://cdn.discordapp.com/attachments/930396635773681664/942754159151710229/IMG_3563.png"
      }
    ];

    for(let i = 0; i < content.length; i++) {
      msg.channel.send({
        embeds: [{
          "title": content[i].header,
          "description": content[i].content,
          "color": colour,
          "timestamp": new Date(),
          "footer": {
            text: footer
          },
          image: { url: content[i].image },
        }]
      });
    }

    msg.channel.send("Server Invite:  https://discord.gg/ZDSVbCtj96");
    msg.channel.send("Official Subreddit: https://www.reddit.com/r/brooklynninenine/");
  },
};