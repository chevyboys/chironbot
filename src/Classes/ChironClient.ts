import { Snowflake } from "discord.js";
import { HexColorString, Client } from "discord.js";
import { ChironParseFunction, IChironClient, IChironClientOptions, IErrorHandlerFunction } from "../Headers/Client";
import { IChironConfig } from "../Headers/Config";
import { IModuleManager } from "../Headers/ModuleManager";
import { ModuleManager } from "./ModuleManager";
import { DefaultErrorHandler, DefaultParseMessage } from "../Objects/ClientDefaults";


export class ChironClient extends Client implements IChironClient {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    DEBUG: boolean //weather or not to enable Debugging mode and instant guild command registration
    errorHandler?: IErrorHandlerFunction
    smiteArray: Array<Snowflake> //an array of people to deny permissions to in all cases
    modules: IModuleManager;
    parser: ChironParseFunction;



    constructor(ChironClientOptions: IChironClientOptions) {
        super(ChironClientOptions);
        this.config = ChironClientOptions.config;
        this.color = ChironClientOptions.color;
        this.modulePath = ChironClientOptions.modulePath;
        this.DEBUG = ChironClientOptions.DEBUG || false;
        this.errorHandler = ChironClientOptions.errorHandler || DefaultErrorHandler;
        this.smiteArray = ChironClientOptions.smiteArray || [];
        this.parser = ChironClientOptions.parser || DefaultParseMessage
        this.modules = new ModuleManager(this);

    }
}