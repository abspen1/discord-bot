var Redis = require('ioredis')

const redisPass = process.env.REDIS_PASS
const redisHost = process.env.REDIS_HOST

var redis = new Redis({
    port: 6379,          // Redis port
    host: redisHost,   	 // Redis host
    password: redisPass, // Redis pass
    db: 9,				 // Redis database
})

// client.hgetall("Hero", function (err, result) {
//     if (err) {
//         console.error(err);
//     } else {
//         const entries = Object.entries(result)
//         for (var [name, val] of entries) {
//             console.log(`There are ${val} ${name}`)
//         }
//     }
// });

// client.smembers("testss", function (err, result) {
//     if (err) {
//         console.error(err);
//     } else {
//         for (var i = 0; i < result.length; i++) {
//             console.log(result[i]);
//             //Do something
//         }
//     }
// });
async function get_hash(args) {
	commandHash = "hash-" + args.join(' ') + "-commands";
	functionHash = "hash-" + args.join(' ') + "-functions";

	redis.hgetall(commandHash, function (err, result) {
		if (err) {
			console.error(err)
			data.push(`Error occured trying to get commands for Version ${args}`)
		} else {
			if (result) {
				data.push("-------------\n\tCommands\n-------------")
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
							data.push("-------------\n\tFunctions\n-------------")
							const entries = Object.entries(result)
							for (var [name, description] of entries) {
								data.push(`${name}: ${description}`)
							}
						}
					}
				})
			} else {
				data.push(`${args} is not a valid version of BotGuy`)

				client.smembers("BotGuy-Versions", function (errors, res) {
					if (errors) {
						console.error(errors)
					} else {
						for (var i = 0; i < res.length; i++) {
							data.push(res[i])
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

module.exports = {
	name: 'version',
	description: 'Give insight into the versions of BotGuy.',
	args: true,
	execute(message, args) {
		get_hash(args).then(() => console.log(`DM sent with info on version`))
	},
};