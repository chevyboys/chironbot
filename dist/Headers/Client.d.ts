import { Interaction, Message, Snowflake } from "discord.js";
import { HexColorString, Client, ClientOptions } from "discord.js";
import { IModuleManager } from "./ModuleManager";
import { IChironConfig } from "./Config";
export interface IChironClientOptions extends ClientOptions {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    DEBUG: boolean;
    errorHandler?: IErrorHandlerFunction;
    smiteArray: Array<Snowflake>;
}
export interface IChironClient extends Client {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    DEBUG: boolean;
    errorHandler?: IErrorHandlerFunction;
    smiteArray: Array<Snowflake>;
    modules: IModuleManager;
}
export interface IErrorHandlerFunction {
    (error: any, msg: Message | Interaction | string): any;
}
