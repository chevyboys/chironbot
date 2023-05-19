import { Client } from "discord.js";
import { ModuleManager } from "./ModuleManager";
import { DefaultErrorHandler, DefaultParseMessage } from "../Objects/ClientDefaults";
export class ChironClient extends Client {
    config;
    color;
    modulePath;
    errorHandler;
    modules;
    parser;
    constructor(ChironClientOptions) {
        super(ChironClientOptions);
        this.config = ChironClientOptions.config;
        this.color = ChironClientOptions.color;
        this.modulePath = ChironClientOptions.modulePath;
        this.errorHandler = ChironClientOptions.errorHandler || DefaultErrorHandler;
        this.parser = ChironClientOptions.parser || DefaultParseMessage;
        this.modules = new ModuleManager(this);
        process.on('SIGTERM', async () => {
            await this.modules.unregister();
            process.exit();
        });
        process.on("beforeExit", async () => {
            await this.modules.unregister();
            process.exit();
        });
    }
}
//# sourceMappingURL=ChironClient.js.map