function onMessageFunc(client, msg, EmbedStuff, prefix) {
  const MsgWithCaps = JSON.parse(JSON.stringify(msg)); // Deep cloning the msg object so that it retains the capitals.
  // The MsgWithCaps object can be used whenever we need to manipulate the message with its original capitals.
  // Deep Cloning in JS: https://blog.logrocket.com/methods-for-deep-cloning-objects-in-javascript/
  msg.content = msg.content.toLowerCase();

  if(!msg.content.startsWith(prefix) && ["760258600983199764", "789432329168355328"].includes(msg.channel.id)) triviaPointsCollection(uri, msg);
  else if(msg.author.bot || !msg.content.startsWith(prefix)) return;

  const command = cmdFormatting(msg.content);

  client.commands.get(command).execute(msg, args, prefix, EmbedStuff)

}

function cmdFormatting(content) {
  const args = content.slice(preflix.length).trim().split(/ + /);
  const command = args.shift().toLowerCase();
  return command;
}

module.exports = {
  onMessage: onMessageFunc
};

//On message sent event ------------------------------------------
client.on('messageCreate', msg => {

  switch(command) {
    case "help":
      client.commands.get('help').execute(msg, args, prefix);
    break;

    case "topic":
      console.log("TOPIC")
    //if(msg.author.id != "777439703515267082")
      client.commands.get('topic').execute(msg, command, topics, colour);
    break;

    case "triviapts":
      client.commands.get('triviapts').execute(msg, args, typicalEmbed, colour, footer, uri, command);
    break;

    case "trivialb":
      client.commands.get('trivialb').execute(msg, args, typicalEmbed, colour, footer, uri, command);
    break;
      
    case "raypts":
      client.users.fetch(args[0] || msg.author.id).then((user) => {
        client.commands.get('raypts').execute(msg, args, typicalEmbed, user, colour, footer, uri, command);
      });
    break;
    
    case "raylb":
      client.commands.get('raylb').execute(msg, args, typicalEmbed, colour, footer, uri, command);
    break;
      
    case "rayreset":
      if (
        msg.member.roles.cache.has("535155142870433841") == true ||          msg.member.roles.cache.has("938012155293335602") == true ||    msg.member.roles.cache.has("796377773799243776") == true || msg.member.roles.cache.has("535152953862914058") == true){
       client.commands.get('rayreset').execute(msg, args, typicalEmbed, colour, footer, uri, command);
      } else {
        msg.channel.send("You can't do that, Hitchcock.")
      }
    break;
      
      case "ahgwinner":
      client.commands.get('ahgwinner').execute(msg, args, typicalEmbed, colour, footer, uri, command);
      break;

      case "triviawinner":
      client.commands.get('triviawinner').execute(msg, args, typicalEmbed, colour, footer, uri, command);
      break;
      
    case "rules":
      console.log("Rules")
      if(msg.member.roles.cache.has("535155142870433841") == true || msg.member.roles.cache.has("938012155293335602") == true)
        client.commands.get("rules").execute(msg, args, colour, footer);
      else
        msg.channel.send("You can't do that!");
    break;
    
    case "addtrivia":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('785441338065551371') == true || msg.member.roles.cache.has("938012155293335602") == true) {
        client.commands.get("addtrivia").execute(msg, args, typicalEmbed, colour, footer, uri, command);
      } else {
        msg.channel.send("You can't do that!");
      }
    break;

    case "remtrivia":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('785441338065551371') == true) {
        client.commands.get("remtrivia").execute(msg, args, typicalEmbed, colour, footer, uri, command);
      } else {
        msg.channel.send("You can't do that!");
      }
    break;
    
    case "addtopic":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('785441338065551371') == true) {
        client.commands.get("addtopic").execute(msg, args, uri, command);
      } else {
        msg.channel.send("You can't do that!");
      }
    break;
    
    case "remtopic":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('785441338065551371') == true) {
        client.commands.get("remtopic").execute(msg, args, uri, command);
        const data = JSON.parse(fs.readFileSync("./JSONs/topics.json", "utf8"));
        topic = data;
      } else {
        msg.channel.send("You can't do that!");
      }
    break;

    case "holtgame":
      client.commands.get("holtgame").execute(msg, args, colour, footer, command, RayQuotes);
    break;

    case "suggestquote":
      client.commands.get("suggestquote").execute(msg, args, client.channels.cache.get("930396635773681664"), command);
    break;

    case "suggesttopic":
      client.commands.get("suggesttopic").execute(msg, args, client.channels.cache.get("769483384849563648"), command);
    break;

    case "addrayquote":
      if (
        msg.member.roles.cache.has("535155142870433841") == true ||          msg.member.roles.cache.has("938012155293335602") == true ||    msg.member.roles.cache.has("796377773799243776") == true || msg.member.roles.cache.has("535152953862914058") == true){
        if (args[0]) {
          if (args[0].toLowerCase() === `real` || args[0].toLowerCase() === `fake`) {
            let argsAnswer = args[0].toLowerCase()
              client.commands.get("addrayquote").execute(msg, args, colour, argsAnswer, footer, uri, command);
          } else { msg.channel.send(`Not enough arguments passed. Syntax is \`>addrayquote <Real/Fake:Answer> <Quote:Question>\`.`) } } else { msg.channel.send(`Not enough arguments passed. Syntax is \`>addrayquote <Real/Fake:Answer> <Quote:Question>\`.`) }
      } else { msg.channel.send("You can't do that!"); }
    break;

    case "remrayquote":
      if (
        msg.member.roles.cache.has("535155142870433841") == true ||          msg.member.roles.cache.has("938012155293335602") == true ||    msg.member.roles.cache.has("796377773799243776") == true || msg.member.roles.cache.has("535152953862914058") == true){
        client.commands.get("remrayquote").execute(msg, args, colour, footer, uri, command);
      } else { msg.channel.send("You can't do that!"); }
    break;

    case "ping":
      msg.channel.send("Pinging...").then(m =>{
        // The math thingy to calculate the user's ping
          var ping = m.createdTimestamp - msg.createdTimestamp;

        // Basic embed
          var embed = new MessageEmbed()
          .setAuthor(`Your ping is ${ping}`)
          
          // Then It Edits the message with the ping variable embed that you created
          m.edit(embed)
      });
    break;

    case "qotw":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('889829830483398657') == true || msg.member.roles.cache.has("938012155293335602") == true) {
        client.commands.get("qotw").execute(msg, args, client, colour, footer);
      } else msg.channel.send("You need to be a moderator or above to do this, Hitchcock.");
    break;
      
    case "bio":
      client.commands.get("bio").execute(msg, args, colour, footer, command, client, uri);
    break;

    case "bioadd":
      client.commands.get("bioadd").execute(msg, args, colour, footer, command, client, uri, MsgWithCaps, prefix);
    break;

    case "bioremove":
      client.commands.get("bioremove").execute(msg, args, colour, footer, command, client, uri);
    break;

    case "trivia drop":
      if(msg.member.roles.cache.has('535155142870433841') == true || msg.member.roles.cache.has('889829830483398657') == true || msg.member.roles.cache.has("938012155293335602") == true) {
        client.commands.get("triviadrop").execute(msg, args, client, uri);
      } else { msg.channel.send("You need to be a mod to reset trivia, Hitchcock."); }
    default:
      break;
  }
});