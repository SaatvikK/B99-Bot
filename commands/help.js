module.exports = {
	name: 'help',
	description: 'You are here',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(msg, args, prefix) {
		const data = [];
		const { commands } = msg.client;

		if (!args.length) {
			data.push('Here\'s a list of all my commands:\n');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`You can send \`${prefix}help [command name]\` to get info on a specific command!`);

			return msg.channel.send(data.join("\n"))
				/*.then(() => {
					if (msg.channel.type === 'dm') return;
					msg.reply('I\'ve sent you a DM with all my commands!');

				}).catch(e => {
					msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				})*/;
		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		
		if (!command) {
			return msg.reply('that\'s not a valid command!');
		}
		
		data.push(`**Name:** ${command.name}`);
		
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
		
		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		
		msg.channel.send(data, { split: true });
	},
};