var Redis = require('ioredis')

const redisPass = process.env.REDIS_PASS
const redisHost = process.env.REDIS_HOST

var redis = new Redis({
    port: 6379,          // Redis port
    host: redisHost,   	 // Redis host
    password: redisPass, // Redis pass
    db: 9,				 // Redis database
})

// if (client.sismember("testss", inputStr)){
//     console.log("Thats already in our projects!")
// }
// else {
//     console.log("Adding project")
// }
async function get_hash(message, args) {
	commandHash = "hash-" + args.join(' ') + "-commands";
	functionHash = "hash-" + args.join(' ') + "-functions";

	let data = []

	redis.hgetall(commandHash, function (err, result) {
		if (err) {
			console.error(err)
			data.push(`Error occured trying to get commands for Version ${args}`)
		} else {
			if (result) {
				data.push(`MODULES AVAILABLE TO BOTGUY AS OF VERSION ${args}\n`)
				data.push("------------------\n\tCommands\n------------------")
				const entries = Object.entries(result)
				for (var [name, description] of entries) {
					data.push(`${name}: ${description}`)
				}
				redis.hgetall(functionHash, function (err, result) {
					if (err) {
						console.error(err)
						data.push(`Error occured trying to get functions for Version ${args}`)
					} else {
						if (result) {
							data.push("------------------\n\tFunctions\n------------------")
							const entries = Object.entries(result)
							for (var [name, description] of entries) {
								data.push(`${name}: ${description}`)
							}
						}
					}
				})
			}
		}
	})


	return message.author.send(data, { split: true })
		.then(() => {
			if (message.channel.type === 'dm') return;
			message.reply('I\'ve sent you a DM with the version details!');
		})
		.catch(error => {
			console.error(`Could not send version DM to ${message.author.tag}.\n`, error);
			message.reply('it seems like I can\'t DM you!');
		});
}

async function get_versions(message) {
	let data = [];

	data.push("Here are all versions for BotGuy:")
	client.smembers("BotGuy-Versions", function (errors, res) {
		if (errors) {
			console.error(errors)
		} else {
			for (var i = 0; i < res.length; i++) {
				data.push(res[i])
			}
		}
	})
	return message.author.send(data, { split: true })
		.then(() => {
			if (message.channel.type === 'dm') return;
			message.reply('I\'ve sent you a DM with all versions!');
		})
		.catch(error => {
			console.error(`Could not send versions DM to ${message.author.tag}.\n`, error);
			message.reply('it seems like I can\'t DM you!');
		});
}

async function not_version(message) {
	let data = [];

	data.push(`${args} is not a valid version of BotGuy`)
	data.push("Here are all versions for BotGuy:")
	client.smembers("BotGuy-Versions", function (errors, res) {
		if (errors) {
			console.error(errors)
		} else {
			for (var i = 0; i < res.length; i++) {
				data.push(res[i])
			}
		}
	})

	return message.author.send(data, { split: true })
		.then(() => {
			if (message.channel.type === 'dm') return;
			message.reply('I\'ve sent you a DM with all versions!');
		})
		.catch(error => {
			console.error(`Could not send versions DM to ${message.author.tag}.\n`, error);
			message.reply('it seems like I can\'t DM you!');
		});
}

module.exports = {
	name: 'version',
	description: 'Give insight into the versions of BotGuy.',
	args: true,
	execute(message, args) {
		versions = args.join(' ');

		if (versions === "all") {
			get_versions(message).then(() => console.log(`DM sent with all available versions.`));
		} else {
			if (client.sismember("BotGuy-Versions", args)){
		    	get_hash(message, args).then(() => console.log(`DM sent with info on version.`));
			}
			else {
				not_version(message).then(() => console.log(`DM sent with wrong version message.`));
			}
		}
	},
};