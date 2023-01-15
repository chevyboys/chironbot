import {Snowflake } from "discord.js";

export interface WebhookConfig {
    name: string;
    url: URL;
}

export interface ChironConfig {
    adminIds: Array<Snowflake>; //an array of discord user snowflakes for bot administration staff
    database: object; //the database login information
    prefix: string; //a prefix to recognize text commands
    repo: URL; //a URL to the github repo for the bot
    token: string; //the token to login with
    webhooks: Array<WebhookConfig>; //An array of debugging webhooks
    adminServer: Snowflake
}