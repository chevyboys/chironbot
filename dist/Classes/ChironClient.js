import { Client } from "discord.js";
import { ModuleManager } from "./ModuleManager";
import { DefaultErrorHandler, DefaultParseMessage } from "../Objects/ClientDefaults";
import * as schedule from "node-schedule";
async function gracefulShutdown(client) {
    await client.modules.unregister();
    return await schedule.gracefulShutdown();
}
export class ChironClient extends Client {
    /**
     * The config object for the client
     * @type {IChironConfig}
     * @memberof ChironClient
     * @readonly
     * @instance
     * @public
     * @property
     * @see {@link IChironConfig}
     */
    config;
    /**
     * The color of the client. Only used if you use it or use utility functions provided by compatible frameworks
     * @type {HexColorString}
     * @memberof ChironClient
     * @readonly
     * @instance
     * @public
     * @property
     * @see {@link HexColorString}
     */
    color;
    /**
     * The path or paths to the modules folder. If you have multiple module folders, you can specify them here as an array
     * @type {string | Array<string>}
     * @memberof ChironClient
     * @readonly
     * @instance
     * @public
     * @property
     *
     * @example
     * //Single module folder
     * const client = new ChironClient({
     *    modulePath: "dist/modules"
     * });
     * @example
     * //Multiple module folders
     * const client = new ChironClient({
     *   modulePath: ["dist/modules", "dist/modules2"]
     * });
     *
     * @see {@link IChironClientOptions}
     *
     */
    modulePath;
    /**
     * The error handler function for the client. If you don't specify one, it will use the default error handler
     * @type {IErrorHandlerFunction}
     * @memberof ChironClient
     * @readonly
     * @instance
     * @public
     * @property
     * @see {@link IErrorHandlerFunction}
     * @see {@link DefaultErrorHandler}
     *
     * @example defaultErrorHandler
     * const client = new ChironClient({
     *  errorHandler: (error, msg) => {
     *     console.error(Date());
     *     if (msg instanceof Message) {
     *       const channelName = !(msg.channel instanceof GuildChannel) ?
     *          msg.channel instanceof DMChannel ?
     *             msg.channel.recipient :
     *             "Unknown Private Thread Channel" :
     *          msg.channel.name;
     *       console.error(`${msg.author.username} in ${(msg.guild ? (`${msg.guild.name} > ${channelName}`) : "DM")}: ${msg.cleanContent}`);
     *     } else if (msg) {
     *       console.error(msg);
     *      }
     *  console.error(error);
     * }
     * });
     *
     *
     *
     * @example webhookErrorHandler
     * const client = new ChironClient({
     * errorHandler: (error, msg) => {
     * const webhook = new WebhookClient({
     * id: "1234567890",
     * token: "abc123"
     * });
     * webhook.send({
     *  content: `Error: ${error}\nMessage: ${msg}`
     * });
     * }
     * });
     *
     *
     */
    errorHandler;
    /**
     * the module manager for the client
     * @type {IModuleManager}
     * @memberof ChironClient
     * @readonly
     * @instance
     * @public
     * @property
     * @see {@link IModuleManager}
     *
     * @example
     * const client = new ChironClient({
     * modulePath: "dist/modules"
     * });
     *
     *
     */
    modules;
    /**
     * The parser function for the client to parse message commands into their arguments. If you don't specify one, it will use the default parser. The parser must accept a discord message object return an object with the command and suffix properties
     * @type {ChironParseFunction}
     * @memberof ChironClient
     * @readonly
     * @instance
     * @public
     * @property
     * @see {@link ChironParseFunction}
     * @see {@link DefaultParseMessage}
     *
     */
    parser;
    /**
     *
     * @param ChironClientOptions The options for the client
     * @example
     * const client = new ChironClient({
     * modulePath: "dist/modules"
     * color: "#FF0000",
     * config: {
     *  prefix: "!",
     *  token: "abc123",
     *  adminIds: ["1234567890"],
     *  database: {},
     *  repo: "https://github.com/chevyboys/chiron",
     *  webhooks: [{name: "test", url: "https://discord.com/api/webhooks/1234567890/abc123"}],
     *  adminServer: "1234567890",
     *  DEBUG: false,
     *  smiteArray: ["1234567890", "abc123"]
     * }
     * });
     */
    constructor(ChironClientOptions) {
        super(ChironClientOptions);
        this.config = ChironClientOptions.config;
        this.color = ChironClientOptions.color;
        this.modulePath = ChironClientOptions.modulePath;
        this.errorHandler = ChironClientOptions.errorHandler || DefaultErrorHandler;
        this.parser = ChironClientOptions.parser || DefaultParseMessage;
        this.modules = new ModuleManager(this);
        process.on('SIGTERM', async () => {
            await gracefulShutdown(this);
            process.exit(0);
        });
        process.on("beforeExit", async () => {
            await gracefulShutdown(this);
            process.exit(0);
        });
        process.on('SIGINT', async () => {
            await gracefulShutdown(this);
            process.exit(0);
        });
    }
}
//# sourceMappingURL=ChironClient.js.map