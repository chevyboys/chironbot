import { HexColorString, Client } from "discord.js";
import { ChironParseFunction, IChironClient, IChironClientOptions, IErrorHandlerFunction } from "../Headers/Client";
import { IChironConfig } from "../Headers/Config";
import { IModuleManager } from "../Headers/ModuleManager";
export declare class ChironClient extends Client implements IChironClient {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    errorHandler?: IErrorHandlerFunction;
    modules: IModuleManager;
    parser: ChironParseFunction;
    constructor(ChironClientOptions: IChironClientOptions);
}
