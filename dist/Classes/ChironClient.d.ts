import { Snowflake } from "discord.js";
import { HexColorString, Client } from "discord.js";
import { IChironClient, IChironClientOptions, IErrorHandlerFunction } from "../Headers/Client";
import { IChironConfig } from "../Headers/Config";
import { IModuleManager } from "../Headers/ModuleManager";
export declare class ChironClient extends Client implements IChironClient {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    DEBUG: boolean;
    errorHandler?: IErrorHandlerFunction;
    smiteArray: Array<Snowflake>;
    modules: IModuleManager;
    constructor(ChironClientOptions: IChironClientOptions);
}
