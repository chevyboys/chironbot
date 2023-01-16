import { IChironConfig, IChironConfigOptions, IWebhookConfig } from "../Headers/Config";
import { Snowflake } from "discord.js";




export class ChironConfig implements IChironConfig {
    adminIds: Array<Snowflake>; //an array of discord user snowflakes for bot administration staff
    database: object; //the database login information
    prefix: string; //a prefix to recognize text commands
    repo?: URL | string; //a URL to the github repo for the bot
    token: string; //the token to login with
    webhooks?: Array<IWebhookConfig>; //An array of debugging webhooks
    adminServer: Snowflake
    constructor(options: IChironConfigOptions) {
        this.adminIds = options.adminIds;
        this.database = options.database;
        this.prefix = options.prefix || "!";
        this.repo = options.repo;
        this.token = options.token;
        this.webhooks = options.webhooks;
        this.adminServer = options.adminServer;
    }
}