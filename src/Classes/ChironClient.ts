import { Snowflake } from "discord.js";
import { HexColorString, Client } from "discord.js";
import { IChironClient, IChironClientOptions, IErrorHandlerFunction } from "../Headers/Client";
import { IChironConfig } from "../Headers/Config";
import { IModuleManager } from "../Headers/ModuleManager";
import { ModuleManager } from "./ModuleManager";
import { DefaultErrorHandler } from "./Objects/ClientDefaults";


export class ChironClient extends Client implements IChironClient {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    DEBUG: boolean //weather or not to enable Debugging mode and instant guild command registration
    errorHandler?: IErrorHandlerFunction
    smiteArray: Array<Snowflake> //an array of people to deny permissions to in all cases
    modules: IModuleManager



    constructor(ChironClientOptions: IChironClientOptions) {
        super(ChironClientOptions);
        this.config = ChironClientOptions.config;
        this.color = ChironClientOptions.color;
        this.modulePath = ChironClientOptions.modulePath;
        this.DEBUG = ChironClientOptions.DEBUG || false;
        this.errorHandler = ChironClientOptions.errorHandler || DefaultErrorHandler;
        this.smiteArray = ChironClientOptions.smiteArray || [];
        this.modules = new ModuleManager(this);
    }
}