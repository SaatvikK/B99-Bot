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