import { Snowflake } from "discord.js";


export interface IChironConfigOptions {
    adminIds: Array<Snowflake>; //an array of discord user snowflakes for bot administration staff
    database: object; //the database login information
    prefix?: string; //a prefix to recognize text commands
    repo?: URL | string; //a URL to the github repo for the bot
    token: string; //the token to login with
    webhooks?: Array<IWebhookConfig>; //An array of debugging webhooks
    adminServer: Snowflake
}
export interface IWebhookConfig {
    name: string;
    url: URL | string;
}

export interface IChironConfig {
    adminIds: Array<Snowflake>; //an array of discord user snowflakes for bot administration staff
    database: object; //the database login information
    prefix?: string; //a prefix to recognize text commands
    repo?: URL | string; //a URL to the github repo for the bot
    token: string; //the token to login with
    webhooks?: Array<IWebhookConfig>; //An array of debugging webhooks
    adminServer: Snowflake
}