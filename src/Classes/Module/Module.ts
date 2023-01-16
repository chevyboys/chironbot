import { SlashCommandBuilder, ContextMenuCommandBuilder, Interaction, Events, Message } from "discord.js";
import { customIdFunction, IBaseComponent, IBaseComponentOptions, IBaseExecFunction, IBaseInteractionComponent, IBaseInteractionComponentOption, IBaseProcessFunction, IChironModule, IChironModuleOptions, IClockworkComponent, IContextMenuCommandComponent, IContextMenuCommandComponentOptions, IEventComponent, IEventComponentOptions, IEventProcessFunction, IInteractionPermissionsFunction, IInteractionProcessFunction, IMessageCommandComponent, IMessageCommandComponentOptions, IMessageCommandPermissionsFunction, IMessageCommandProcessFunction, IMessageComponentInteractionComponentOptions, IModuleLoading, ISlashCommandComponent, ISlashCommandComponentOptions } from "../../Headers/Module";
import { ChironClient } from "../ChironClient";
import path from "path"

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);


export class ChironModule implements IChironModule {
    name: string;
    components: Array<IBaseComponent>;
    client?: ChironClient;
    file?: string

    constructor(ModuleOptions: IChironModuleOptions) {
        let fileName = path.basename(__filename);
        if (ModuleOptions.client instanceof ChironClient) {
            this.client = ModuleOptions.client;
        }
        this.name = ModuleOptions.name || fileName;
        this.components = ModuleOptions.components.map(component => {
            component.module = this
            return component;
        }
        )
    }
}

/* ------------------------------------------------------------------------------------------------------
 * ----------------- Component Classes ---------------------------------------------------------------
 */

//------------------- Base Component ------------------------------
// All components are derived from this
export class BaseComponent implements IBaseComponent {
    readonly enabled: boolean;
    readonly process: IBaseProcessFunction;
    module?: IChironModule;
    exec: IBaseExecFunction;

    constructor(BaseComponentOptions: IBaseComponentOptions) {
        this.enabled = BaseComponentOptions.enabled
        this.process = BaseComponentOptions.process
        if (BaseComponentOptions.module)
            this.module = BaseComponentOptions.module;
        this.exec = this.process

    }
}


//--------------------------------------------------------------------------
//------------------- Base Interact Component ------------------------------
// The base for all other Interaction Components

export class BaseInteractionComponent extends BaseComponent implements IBaseInteractionComponent {
    readonly name: string; //derived from the builder
    description: string; //derived from the builder if not directly defined
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction // a function that receives an interaction and returns if the function is allowed to be executed

    constructor(BaseInteractionComponentOptions: IBaseInteractionComponentOption) {
        super(BaseInteractionComponentOptions)
        this.name = BaseInteractionComponentOptions.builder.name;
        //description is implimented in child classes, we only impliment here as a fallback
        this.description = "";
        this.builder = BaseInteractionComponentOptions.builder;
        this.category = BaseInteractionComponentOptions.category || this.module?.file || "General";
        this.permissions = BaseInteractionComponentOptions.permissions;
        this.exec = (interaction: Interaction) => {
            if (!this.enabled || !this.permissions(interaction)) {
                if (interaction.isRepliable()) interaction.reply({ content: "I'm sorry, but you aren't allowed to do that.", ephemeral: true });
                return "I'm sorry, This feature is restricted behind a permissions lock";
            }
            else if (this.module?.client instanceof ChironClient && this.module?.client.smiteArray.includes(interaction.user.id)) {
                if (interaction.isRepliable()) interaction.reply({ content: "This feature is unavailable to you.", ephemeral: true });
                return interaction.user.username + " Was blocked from using " + this.name + " by Smite System";
            } else return this.process(interaction);

        }
    }

}

//--------------------------------------------------------------------------
//------------------- Slash Command Component ------------------------------
// Slash command Component
export class SlashCommandComponent extends BaseInteractionComponent implements ISlashCommandComponent {
    readonly builder: SlashCommandBuilder;

    constructor(SlashCommandComponentOptions: ISlashCommandComponentOptions) {
        super(SlashCommandComponentOptions)
        this.description = SlashCommandComponentOptions.description || SlashCommandComponentOptions.builder.description || "";
        this.builder = SlashCommandComponentOptions.builder;
    }
}

//--------------------------------------------------------------------------
//------------------- Context Menu Command Component ------------------------------
// The base for all other Interaction Components



export class ContextMenuCommandComponent extends BaseInteractionComponent implements IContextMenuCommandComponent {
    readonly builder: ContextMenuCommandBuilder //Contains our name and description
    readonly description: string

    constructor(ContextMenuCommandComponentOptions: IContextMenuCommandComponentOptions) {
        super(ContextMenuCommandComponentOptions)
        this.description = ContextMenuCommandComponentOptions.description || "";
        this.builder = ContextMenuCommandComponentOptions.builder;
    }
}

//--------------------------------------------------------------------------
//event handler

export class EventComponent extends BaseComponent implements IEventComponent {
    trigger: Events | any
    process: IEventProcessFunction
    constructor(EventComponentOptions: IEventComponentOptions) {
        super(EventComponentOptions)
        this.trigger = EventComponentOptions.trigger;
        this.process = EventComponentOptions.process;
        this.exec = (...args: any) => {
            let argFinder = Array.isArray(args) ? args : [args];
            for (const arg of argFinder) {
                if (arg?.member?.id || arg?.user?.id || arg.author?.id || arg?.id) {
                    let id = arg?.member?.id || arg?.user?.id || arg.author?.id || arg?.id;
                    if (this.module?.client instanceof ChironClient && this.module?.client.smiteArray.includes(id)) {
                        return "Smite System Blocked Event Triggered by " + id;
                    }
                }

            }
            return this.process.apply(null, args)
        }
    }
}

//-------------------------------------------------------------------------
// Message Component interaction

export class MessageComponentInteractionComponent extends EventComponent implements IEventComponent {
    customId: customIdFunction;
    process: IInteractionProcessFunction;
    constructor(MessageComponentInteractionComponentOptions: IMessageComponentInteractionComponentOptions) {
        super(MessageComponentInteractionComponentOptions)
        this.process = MessageComponentInteractionComponentOptions.process
        this.customId = (string: string) => {
            if (typeof MessageComponentInteractionComponentOptions.customId == "function") {
                return MessageComponentInteractionComponentOptions.customId(string)
            } else {
                return string == MessageComponentInteractionComponentOptions.customId;
            }
        }
        this.exec = (interaction: Interaction | any) => {
            if (interaction?.member?.id || interaction?.user?.id || interaction.author?.id) {
                let id = interaction?.member?.id || interaction?.user?.id || interaction.author?.id;
                if (this.module?.client instanceof ChironClient && this.module?.client.smiteArray.includes(id)) {
                    interaction.reply({ ephemeral: true, content: "I'm sorry, I can't do that for you. (Response code SM173)" })
                    return "Smite System Blocked Event Triggered by " + id;
                }
            }

            return this.process(interaction)
        }
    }
}

//--------------------------------------------------------------------------
//------------------------ Clockwork Components ----------------------------


export class ClockworkComponent extends BaseComponent implements IClockworkComponent {
    readonly interval: number //the number of seconds to wait between refresh intervals
    constructor(ClockworkComponentOptions: any) {
        super(ClockworkComponentOptions)
        this.interval = ClockworkComponentOptions.interval
    }
}

//-------------------------------------------------------------------------
//---------------- Module Loading and unloading components ----------------

export class ModuleLoading extends BaseComponent implements IModuleLoading {

}

export class ModuleUnloading extends BaseComponent {

}

//-------------------------------------------------------------------------
//------------------ Message Command --------------------------------------
export class MessageCommandComponent extends EventComponent implements IMessageCommandComponent {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly permissions: IMessageCommandPermissionsFunction // a function that receives an interaction and returns if the function is allowed to be executed
    process: IMessageCommandProcessFunction;
    constructor(MessageCommandOptions: IMessageCommandComponentOptions) {
        super(MessageCommandOptions)
        this.name = MessageCommandOptions.name;
        this.description = MessageCommandOptions.description;
        this.category = MessageCommandOptions.category || path.basename(__filename);
        this.permissions = MessageCommandOptions.permissions
        this.process = MessageCommandOptions.process
        this.exec = (message: Message) => {
            if (!this.module?.client && this.module?.client instanceof ChironClient) {
                let parsed = this.module.client.parser(message, this.module.client);
                if (parsed && parsed.command == this.name) {
                    return this.process(message, parsed.suffix)
                }
                else return "Not a command";
            }
        }
    }

}