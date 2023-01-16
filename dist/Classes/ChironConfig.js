export class ChironConfig {
    adminIds; //an array of discord user snowflakes for bot administration staff
    database; //the database login information
    prefix; //a prefix to recognize text commands
    repo; //a URL to the github repo for the bot
    token; //the token to login with
    webhooks; //An array of debugging webhooks
    adminServer;
    constructor(options) {
        this.adminIds = options.adminIds;
        this.database = options.database;
        this.prefix = options.prefix || "!";
        this.repo = options.repo;
        this.token = options.token;
        this.webhooks = options.webhooks;
        this.adminServer = options.adminServer;
    }
}
//# sourceMappingURL=ChironConfig.js.map