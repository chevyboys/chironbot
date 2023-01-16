import { Client } from "discord.js";
import { ModuleManager } from "./ModuleManager";
import { DefaultErrorHandler, DefaultParseMessage } from "./Objects/ClientDefaults";
export class ChironClient extends Client {
    config;
    color;
    modulePath;
    DEBUG; //weather or not to enable Debugging mode and instant guild command registration
    errorHandler;
    smiteArray; //an array of people to deny permissions to in all cases
    modules;
    parser;
    constructor(ChironClientOptions) {
        super(ChironClientOptions);
        this.config = ChironClientOptions.config;
        this.color = ChironClientOptions.color;
        this.modulePath = ChironClientOptions.modulePath;
        this.DEBUG = ChironClientOptions.DEBUG || false;
        this.errorHandler = ChironClientOptions.errorHandler || DefaultErrorHandler;
        this.smiteArray = ChironClientOptions.smiteArray || [];
        this.parser = ChironClientOptions.parser || DefaultParseMessage;
        this.modules = new ModuleManager(this);
    }
}
//# sourceMappingURL=ChironClient.js.map