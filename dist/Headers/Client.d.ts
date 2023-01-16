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
    parser?: ChironParseFunction;
}
export interface IChironClient extends Client {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    DEBUG: boolean;
    errorHandler?: IErrorHandlerFunction;
    smiteArray: Array<Snowflake>;
    modules: IModuleManager;
    parser: ChironParseFunction;
}
export interface IErrorHandlerFunction {
    (error: any, msg: Message | Interaction | string): any;
}
export interface ChironParsedContent {
    command: string;
    suffix: string;
    params: Array<string>;
}
export interface ChironParseFunction {
    (msg: Message, client: IChironClient): ChironParsedContent | null;
}
