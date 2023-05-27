import { Interaction, Message } from "discord.js";
import { HexColorString, Client, ClientOptions } from "discord.js";
import { IModuleManager } from "./ModuleManager";
import { IChironConfig } from "./Config";

export interface IChironClientOptions extends ClientOptions {
    config: IChironConfig
    color: HexColorString; //the color the bot should default to
    modulePath: string | Array<string>,
    /**
     * the function that will be called when an error occurs. If not provied, a default will be used
     * it is recommended to not use async functions as error event handlers. See the Node.js docs  for details.
     * https://nodejs.org/api/events.html#capture-rejections-of-promises
     */
    errorHandler?: IErrorHandlerFunction
    parser?: ChironParseFunction
}

export interface IChironClient extends Client {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    /**
     * the function that will be called when an error occurs. If not provied, a default will be used
     * it is recommended to not use async functions as error event handlers. See the Node.js docs  for details.
     * https://nodejs.org/api/events.html#capture-rejections-of-promises
     */
    errorHandler?: IErrorHandlerFunction
    modules: IModuleManager
    parser: ChironParseFunction
}

/**
     * the function that will be called when an error occurs. If not provied, a default will be used
     * it is recommended to not use async functions as error event handlers. See the Node.js docs  for details.
     * https://nodejs.org/api/events.html#capture-rejections-of-promises
     */
export interface IErrorHandlerFunction {
    (error: Error, msg: Message | Interaction | string): unknown
}

export interface ChironParsedContent {
    command: string,
    suffix: string,
}

export interface ChironParseFunction {
    (msg: Message, client: IChironClient): ChironParsedContent | null
}
