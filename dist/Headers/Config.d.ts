import { Snowflake } from "discord.js";
export interface IChironConfigOptions {
    adminIds: Array<Snowflake>;
    database: object;
    prefix?: string;
    repo?: URL | string;
    token: string;
    webhooks?: Array<IWebhookConfig>;
    adminServer: Snowflake;
    DEBUG?: boolean;
    smiteArray?: Array<Snowflake>;
}
export interface IWebhookConfig {
    name: string;
    url: URL | string;
}
export interface IChironConfig {
    adminIds: Array<Snowflake>;
    database: object;
    DEBUG: boolean;
    prefix?: string;
    repo?: URL | string;
    token: string;
    webhooks?: Array<IWebhookConfig>;
    adminServer: Snowflake;
    smiteArray: Array<Snowflake>;
}
