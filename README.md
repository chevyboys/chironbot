## Chiron - Discord bot framework

Chiron is a Discord bot framework, utilizing the `discord.js` library.
The npm version "chironbot" is the "Stable" version of the framework. For the alpha channel, install "chevyboys/chiron"
For a basic example bot, take a look at https://github.com/chevyboys/Corrigation


### Change Log

We're still in Alpha, so changes are frequent. See the github for more details.


### Installation

`npm install --save chironbot discord.js node-schedule`

---

## The Chiron Client

Within your base file, import { `ChironConfig`, `ChironClient` } from `chironbot`(or `chiron` if you are using the beta branch) and create a new instance of `ChironClient`:
```
import { `ChironConfig`, `ChironClient` } from `chironbot`
import { configOptions } from "YOUR_CONFIG_TYPESCRIPT_FILE"

const config = new ChironConfig(configOptions)
const client = new ChironClient(options);

client.login();
```

The ChironClient will create the Discord Client, listen for events, and process commands. Any gateway intents must be provided in the intents member of your client options.
Some Suggested default options:
```
const client = new ChironClient({
    config: config,
    color: "#FFFFFF",
    modulePath: "dist/modules",
    partials: [Partials.User, Partials.Message, Partials.Reaction],
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    smiteArray: []
});
```
### The `options` Object extends Discord.ClientOptions

The `options` object includes:

* `color`: The default color the bot should use. Any hex color should work

* `config`: A configuration object containing per instance data. See below

* `modulePath` (string): A directory, relative to the base file, containing any command modules you wish to load. This will only load modules that are ChironModules, are exported under the name "Module", or "Command", but it will search recursively through all folder in the base folder to find more modules.

* `errorHandler`: An optional function accepting `error` and `message` as its arguments. This will replace the default error handling function.

* `parser` (async function): An asynchronous function accepting `message` as its argument, returning an object with `command` and `suffix` properties. This will replace the default parsing function. (Useful in case different servers use different prefixes, for example.)

* `Discord Client options`: Any discord client options

### The `config` Object

Minimum required properties in `config` include:

* `adminIds` (array): An array of discord snowflakes coresponding to people who should be able to administrate the bot
* `database` (object): An object containing your database model, if any. If none, setting this to an empty object is fine
* `token` (string): the token your bot will need to login. 
 CAUTION: This is VERY sensitive. Treat it with the same care you would treat your own discord password. Anyone with this can login as your bot and do anything they want with it.
* `adminServer`: The place slash commands should be registered as guild commands in debug mode (for instant registration and testing)

Additional optional properties include:
* `DEBUG` (boolean): Weather or not to switch to debugging mode, which will register guild commands to your admin server instead of global commands (global commands can take a few hours to appear for clients, guild commands are instantaneous). defaults to false.
* `prefix` (string): A default prefix for text commands. Defaults to `!`. Pinging the bot will work in place of a prefix

* `token` (string): Your bot's Discord token to log in. If provided in the `config` object, it does not need to be passed when `client.login()` is called. If omitted, it *must* be passed with `client.login(token)` when logging in.

* `repo` (string|url): the repository where you can find your bot. Defaults to none

* `webhooks` (array): an array of webhook url's that you want to have access to in your various modules. (best practice is to put most webhooks in some form of database, but this is here if you need it.)

* `smiteArray` (Array of Snowflakes): An array of discord user snowflakes that the bot will attempt to ignore for all interactions and events. Good for punishing people who abuse the bot, or letting someone opt out of all bot features




### ChironClient Properties

Properties of the ChironClient class:

* `config` (object): The config object passed to the client upon initialization.

* `clockwork`: Coming soon

* `DEBUG` (boolean): weather or not debugging is enabled

* `modules` (ModuleManager extends Array):

  An Array of all known modules.
  * `client` (ChironClient): The client.
  * `register(IModuleMAnagerRegisterable)` (function): Registers all modules. It needs an Array of Modules, A module, or a relative directory in a string.


### ChironClient Methods

Methods of the ChironClient class:

* `errorHandler(error, message)`: Error handling function.

* `parse(message)`: Parse a message into its command name and suffix. Returns an object containing `command` (string) and `suffix` (string).

---

## Command File Structure

The basic file structure:
```
import { ChironModule, MessageCommandComponent, SlashCommandComponent } from "chironbot";
import { SlashCommandBuilder, Message } from "discord.js";


export const Module = new ChironModule({
    name: "hello world",
    components: [
        new SlashCommandComponent({
            builder: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
            enabled: true,
            category: "main",
            permissions: (interaction) => { return true },
            process: (interaction) => {
                interaction.isRepliable() ? interaction.reply("Pong!") : console.error("could not reply");
            }
        }),
        new MessageCommandComponent({
            name: "hello",
            description: "replies with 'world'",
            category: "main",
            enabled: true,
            permissions: (msg) => true,
            process: (msg: Message, suffix: string) => {
                msg.reply("world! " + suffix)
                return "";
            }
        }),
    ]

})
```

In between, you can add one or more commands and event handlers, as well as a clockwork and unload function.

`Module` properties include:

* `name`: The friendly name of the Module

* `client`: The Chiron client which loaded the command module.

* `components`: (Array) an array of Components the module owns

### Components
The `new [ComponentClass]()` method defines a new bot Component.

### `Slash Commands`
```
        new SlashCommandComponent({
            builder: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
            enabled: true,
            category: "main",
            permissions: (interaction) => { return true },
            process: (interaction) => {
                //YOUR CODE HERE


                //Example:
                //interaction.isRepliable() ? interaction.reply("Pong!") : console.error("could not reply");
            }
        }),
```
`builder`: A Discord Slash Command Builder with at least the name and description
`enabled`: (boolean) weather or not the command should be processed or registered (disabling it will unregister it with discord)
`category`: (string) the command category, for your use
`permissions`: (Function) a function that receives an interaction, and returns true if the interaction has permission to be executed, or flase if not.
`process`: (Function) a function that takes in an interaction.

### Text Commands
```
        new MessageCommandComponent({
            name: "hello",
            description: "replies with 'world'",
            category: "main",
            enabled: true,
            permissions: (msg) => true,
            process: (msg: Message, suffix: string) => {
                msg.reply("world! " + suffix)
                return "";
            }
        }),

```
* `name` (string): Required. A string for the name of the command.
* `process` (function): Required. The function to run when the command is invoked. This accepts (message, suffix); a `Discord.Message` object and a `suffix` string of the remainder of the command supplied by the user
* `category` (string): A category name, for convenience in organizing commands.
* `description` (string): A short string for a brief overview of the command.
* `enabled` (boolean): Whether the command is able to run. Defaults to `true`.
* `permissions` (function): A function used to determine whether the user has permission to run the command. Accepts a `Discord.Message` object.

### Events
```
import { EventComponent } from "chiron";
import { Events, MessageReaction, User } from "discord.js";

export let HelloWorldEventComponent = new EventComponent({
    trigger: Events.MessageReactionAdd,
    enabled: true,
    process: async (MessageReaction: MessageReaction, user: User) => {
        await MessageReaction.react();
    }
})

```
* `trigger` (Discord Client Events Enum Instance): The Event that triggers this
* `enabled` (boolean): If this trigger should be enabled
* `process` (The function to run when the trigger is invoked. It recieves whatever the discord client gives on that event)

### Context Menu Interactions
```
import { ContextMenuCommandComponent } from "chiron";
import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from "discord.js";


export const HelloWorldContextMenu = new ContextMenuCommandComponent(
    {
        builder: new ContextMenuCommandBuilder().setName("Hello World").setType(ApplicationCommandType.Message),
        description: "Replies 'Hello World!' to any message it is used on",
        category: "general",
        enabled: true,
        permissions: (interaction) => { return true },
        process(interaction) {
            if (interaction instanceof MessageContextMenuCommandInteraction) {
                interaction.reply("Hello World!")
            }
        }
    }
)

```
* `builder`: A Discord Context Menu Builder
* `description`: a string for you to describe it by
* `category` (string): A category name, for convenience in organizing commands.
* `enabled`: (boolean) weather or not the command should be processed or registered (disabling it will unregister it with discord)
* `permissions` (function): A function used to determine whether the user has permission to run the command. Accepts a `Discord.Interaction` object.
* `process` (function): A function that is run when the Context Menu Command of the appropriate name is called

### Message Component Interactions
```
import { MessageComponentInteractionComponent, SlashCommandComponent } from "chiron";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, SlashCommandBuilder } from "discord.js";
export const HelloWorldMessageComponentInteraction = new MessageComponentInteractionComponent({
    customId: (id) => id == "exampleid",
    enabled: true,
    permissions: (interaction) => true;
    process(interaction) {
        if (interaction instanceof ButtonInteraction) {
            interaction.reply({ content: "You pushed me!", ephemeral: true });
        }
    }
});
```
* `customId`: A function that receives a customId string, and returns true if this is the correct processing file for it. Note: it's easy to accidentally include something you don't want to, so be careful and as restrictive as possible
* `enabled`: (boolean) weather or not the command should be processed; (If set to false, previously built buttons using the same customId  as this function may stop working!)
* `process` (function): A function that is run when the Context Menu Command of the appropriate name is called.
* `permissions` (function): A function used to determine whether the user has permission to run the command. Accepts a `Discord.Interaction` object.



### Initialization
* Coming soon

### Unloading
* Coming soon

