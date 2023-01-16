import { IChironConfig, IChironConfigOptions, IWebhookConfig } from "../Headers/Config";
import { Snowflake } from "discord.js";
export declare class ChironConfig implements IChironConfig {
    adminIds: Array<Snowflake>;
    database: object;
    prefix: string;
    repo?: URL | string;
    token: string;
    webhooks?: Array<IWebhookConfig>;
    adminServer: Snowflake;
    constructor(options: IChironConfigOptions);
}
