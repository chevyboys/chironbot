import { Interaction, Message, Snowflake } from "discord.js";
import { HexColorString, Client, ClientOptions } from "discord.js";
import { IModuleManager } from "./ModuleManager";
import { IChironConfig } from "./Config";

export interface IChironClientOptions extends ClientOptions {
    config: IChironConfig
    color: HexColorString; //the color the bot should default to
    modulePath: string | Array<string>,
    errorHandler?: IErrorHandlerFunction
    parser?: ChironParseFunction
}

export interface IChironClientBuilder {
    build?: IChironBuildFunction;
}

export interface IChironClient extends Client {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    errorHandler?: IErrorHandlerFunction
    modules: IModuleManager
    parser: ChironParseFunction
}

export interface IErrorHandlerFunction {
    (error: any, msg: Message | Interaction | string): any
}

export interface ChironParsedContent {
    command: string,
    suffix: string,
    params: Array<string>
}

export interface ChironParseFunction {
    (msg: Message, client: IChironClient): ChironParsedContent | null
}

export interface IChironBuildFunction {
    (ChironClientOptions: IChironClientOptions): Promise<IChironClient>
}
