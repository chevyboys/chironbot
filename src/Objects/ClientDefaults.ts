import { DMChannel, GuildChannel, Message } from "discord.js";
import { ChironParseFunction, IChironClient, IErrorHandlerFunction } from "../Headers/Client";


export let DefaultErrorHandler: IErrorHandlerFunction = function (error, msg) {
    console.error(Date());
    if (msg instanceof Message) {
        let channelName = !(msg.channel instanceof GuildChannel) ?
            msg.channel instanceof DMChannel ?
                msg.channel.recipient :
                "Unknown Private Thread Channel" :
            msg.channel.name;
        console.error(`${msg.author.username} in ${(msg.guild ? (`${msg.guild.name} > ${channelName}`) : "DM")}: ${msg.cleanContent}`);
    } else if (msg) {
        console.error(msg);
    }
    console.error(error);
}



export let DefaultParseMessage: ChironParseFunction = (msg: Message, client: IChironClient) => {
    //This function was provided by @gaiwecoor from Augurbot, and was updated by chevyboys
    let content = msg.content;
    let setPrefix = client.config.prefix || "!";
    if (msg.author.bot) return null;
    for (let prefix of [setPrefix, `<@${msg.client.user.id}>`, `<@!${msg.client.user.id}>`, `<@${msg.client.user.id}>`, `<@!${msg.client.user.id}>`]) {
        if (!content.startsWith(prefix)) continue;
        let trimmed = content.substr(prefix.length).trim();
        let endOfFirstWord = Math.min(...[trimmed.indexOf(" "), trimmed.indexOf("\n")].filter(index => index > -1))
        let command = trimmed.substring(0, endOfFirstWord).trim();
        let suffix = trimmed.substring(endOfFirstWord).trim();
        if (command) {
            return {
                command: command.toLowerCase(),
                suffix: suffix
            };
        }
    }
    return null;
}