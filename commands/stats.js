const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
	name: "stats",
	description: "Gives some useful bot statistics",
	permLevel: 0,
	execute(message, _args, redis, _level) {
		const duration = moment.duration(message.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		redis.get('botguy-version').then((result) => {
			message.channel.send(`= STATISTICS =
			• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
			• Uptime     :: ${duration}
			• Users      :: ${message.client.users.cache.size.toLocaleString()}
			• Servers    :: ${message.client.guilds.cache.size.toLocaleString()}
			• Channels   :: ${message.client.channels.cache.size.toLocaleString()}
			• Discord.js :: v${version}
			• Node       :: ${process.version}
			• BotGuy	 :: v${result}`, {code: "asciidoc"});
		}).catch((_err) => {
			message.channel.send(`= STATISTICS =
			• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
			• Uptime     :: ${duration}
			• Users      :: ${message.client.users.cache.size.toLocaleString()}
			• Servers    :: ${message.client.guilds.cache.size.toLocaleString()}
			• Channels   :: ${message.client.channels.cache.size.toLocaleString()}
			• Discord.js :: v${version}
			• Node       :: ${process.version}`, {code: "asciidoc"});
		});
	},
	test() {
		return true;
	},
}