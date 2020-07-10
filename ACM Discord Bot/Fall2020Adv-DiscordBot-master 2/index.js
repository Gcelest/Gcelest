const fs = require('fs'); //node's file system
const Discord = require('discord.js'); //require discord.js
const { prefix, token } = require('./config.json'); //take prefix and token from config

const client = new Discord.Client();
client.commands = new Discord.Collection();

//read new command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//this is if you want cooldowns for your commands
const cooldowns = new Discord.Collection();

//display ready inside console when bot is ready
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    //check if a message was sent by a bot user and if it has the bot prefix at the beginning of the message
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //filters the message
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

    //cooldowns ??
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});   
client.on("messageReactionAdd", async (reaction, user)=>{
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(user.bot) return;
    if(!reaction.message.guild) return;
    
    if(reaction.message.channel.id === '723451780704370700'){
        //put emoji on the reafction and the await is copy the id of the server roles in server settings
        if(reaction.emoji.name === '🎮'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('729763426473214053');
        }
        else if(reaction.emoji.name === '👾'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('730226583637590057');
        }
        else if(reaction.emoji.name === '💻'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('730226453144272956');
        }
        else if(reaction.emoji.name === '🎲'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('729763531179950170');
        }
        else if(reaction.emoji.name === '📲'){
            await reaction.message.guild.members.cache.get(user.id).roles.add('730279012764745759');
        }
    }
});

client.on("messageReactionRemove", async (reaction, user)=>{
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(user.bot) return;
    if(!reaction.message.guild) return;
    
    if(reaction.message.channel.id === '723451780704370700'){
        //put emoji on the reafction and the await is copy the id of the server roles in server settings
        if(reaction.emoji.name === '🎮'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('729763426473214053');
        }
        else if(reaction.emoji.name === '👾'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('730226583637590057');
        }
        else if(reaction.emoji.name === '💻'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('730226453144272956');
        }
        else if(reaction.emoji.name === '🎲'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('729763531179950170');
        }
        else if(reaction.emoji.name === '📲'){
            await reaction.message.guild.members.cache.get(user.id).roles.remove('730279012764745759');
        }
    }
});

client.login(token);
