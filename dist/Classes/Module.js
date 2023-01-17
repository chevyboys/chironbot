import { Events } from "discord.js";
import { ChironClient } from "./ChironClient";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
export class ChironModule {
    name;
    components;
    client;
    file;
    constructor(ModuleOptions) {
        let fileName = path.basename(__filename);
        if (ModuleOptions.client instanceof ChironClient) {
            this.client = ModuleOptions.client;
        }
        this.name = ModuleOptions.name || fileName;
        this.components = ModuleOptions.components.map(component => {
            component.module = this;
            return component;
        });
    }
}
/* ------------------------------------------------------------------------------------------------------
 * ----------------- Component Classes ---------------------------------------------------------------
 */
//------------------- Base Component ------------------------------
// All components are derived from this
export class BaseComponent {
    enabled;
    process;
    module;
    exec;
    constructor(BaseComponentOptions) {
        this.enabled = BaseComponentOptions.enabled;
        this.process = BaseComponentOptions.process;
        if (BaseComponentOptions.module)
            this.module = BaseComponentOptions.module;
        this.exec = this.process;
    }
}
//--------------------------------------------------------------------------
//------------------- Base Interact Component ------------------------------
// The base for all other Interaction Components
export class BaseInteractionComponent extends BaseComponent {
    name; //derived from the builder
    description; //derived from the builder if not directly defined
    builder;
    category;
    permissions; // a function that receives an interaction and returns if the function is allowed to be executed
    constructor(BaseInteractionComponentOptions) {
        super(BaseInteractionComponentOptions);
        this.name = BaseInteractionComponentOptions.builder.name;
        //description is implimented in child classes, we only impliment here as a fallback
        this.description = "";
        this.builder = BaseInteractionComponentOptions.builder;
        this.category = BaseInteractionComponentOptions.category || this.module?.file || "General";
        this.permissions = BaseInteractionComponentOptions.permissions;
        this.exec = (interaction) => {
            if (!this.enabled || !this.permissions(interaction)) {
                if (interaction.isRepliable())
                    interaction.reply({ content: "I'm sorry, but you aren't allowed to do that.", ephemeral: true });
                return "I'm sorry, This feature is restricted behind a permissions lock";
            }
            else if (this.module?.client instanceof ChironClient && this.module?.client.config.smiteArray.includes(interaction.user.id)) {
                if (interaction.isRepliable())
                    interaction.reply({ content: "This feature is unavailable to you.", ephemeral: true });
                return interaction.user.username + " Was blocked from using " + this.name + " by Smite System";
            }
            else
                return this.process(interaction);
        };
    }
}
//--------------------------------------------------------------------------
//------------------- Slash Command Component ------------------------------
// Slash command Component
export class SlashCommandComponent extends BaseInteractionComponent {
    builder;
    constructor(SlashCommandComponentOptions) {
        super(SlashCommandComponentOptions);
        this.description = SlashCommandComponentOptions.description || SlashCommandComponentOptions.builder.description || "";
        this.builder = SlashCommandComponentOptions.builder;
    }
}
//--------------------------------------------------------------------------
//------------------- Context Menu Command Component ------------------------------
// The base for all other Interaction Components
export class ContextMenuCommandComponent extends BaseInteractionComponent {
    builder; //Contains our name and description
    description;
    constructor(ContextMenuCommandComponentOptions) {
        super(ContextMenuCommandComponentOptions);
        this.description = ContextMenuCommandComponentOptions.description || "";
        this.builder = ContextMenuCommandComponentOptions.builder;
    }
}
//--------------------------------------------------------------------------
//event handler
export class EventComponent extends BaseComponent {
    trigger;
    process;
    constructor(EventComponentOptions) {
        super(EventComponentOptions);
        this.trigger = EventComponentOptions.trigger;
        this.process = EventComponentOptions.process;
        this.exec = (...args) => {
            let argFinder = Array.isArray(args) ? args : [args];
            for (const arg of argFinder) {
                if (arg?.member?.id || arg?.user?.id || arg.author?.id || arg?.id) {
                    let id = arg?.member?.id || arg?.user?.id || arg.author?.id || arg?.id;
                    if (this.module?.client instanceof ChironClient && this.module?.client.config.smiteArray.includes(id)) {
                        return "Smite System Blocked Event Triggered by " + id;
                    }
                }
            }
            return this.process.apply(null, args);
        };
    }
}
//-------------------------------------------------------------------------
// Message Component interaction
export class MessageComponentInteractionComponent extends EventComponent {
    customId;
    process;
    constructor(MessageComponentInteractionComponentOptions) {
        super(MessageComponentInteractionComponentOptions);
        this.trigger = Events.InteractionCreate;
        this.process = MessageComponentInteractionComponentOptions.process;
        this.customId = (string) => {
            if (typeof MessageComponentInteractionComponentOptions.customId == "function") {
                return MessageComponentInteractionComponentOptions.customId(string);
            }
            else {
                return string == MessageComponentInteractionComponentOptions.customId;
            }
        };
        this.exec = (interaction) => {
            if (!this.customId(interaction.customId))
                return;
            if (interaction?.member?.id || interaction?.user?.id || interaction.author?.id) {
                let id = interaction?.member?.id || interaction?.user?.id || interaction.author?.id;
                if (this.module?.client instanceof ChironClient && this.module?.client.config.smiteArray.includes(id)) {
                    interaction.reply({ ephemeral: true, content: "I'm sorry, I can't do that for you. (Response code SM173)" });
                    return "Smite System Blocked Event Triggered by " + id;
                }
            }
            return this.process(interaction);
        };
    }
}
//--------------------------------------------------------------------------
//------------------------ Clockwork Components ----------------------------
export class ClockworkComponent extends BaseComponent {
    interval; //the number of seconds to wait between refresh intervals
    constructor(ClockworkComponentOptions) {
        super(ClockworkComponentOptions);
        this.interval = ClockworkComponentOptions.interval;
    }
}
//-------------------------------------------------------------------------
//---------------- Module Loading and unloading components ----------------
export class ModuleLoading extends BaseComponent {
}
export class ModuleUnloading extends BaseComponent {
}
//-------------------------------------------------------------------------
//------------------ Message Command --------------------------------------
export class MessageCommandComponent extends EventComponent {
    name;
    description;
    category;
    permissions; // a function that receives an interaction and returns if the function is allowed to be executed
    process;
    constructor(MessageCommandOptions) {
        super(MessageCommandOptions);
        this.trigger = Events.MessageCreate;
        this.name = MessageCommandOptions.name;
        this.description = MessageCommandOptions.description;
        this.category = MessageCommandOptions.category || path.basename(__filename);
        this.permissions = MessageCommandOptions.permissions;
        this.process = MessageCommandOptions.process;
        this.exec = (message) => {
            if (!this.enabled)
                return "disabled";
            if (this.module?.client && this.module?.client instanceof ChironClient) {
                if (this.module.client.config.smiteArray.includes(message.author.id))
                    return "Dissallowed by smite system";
                let parsed = this.module.client.parser(message, this.module.client);
                if (parsed && parsed.command == this.name) {
                    return this.process(message, parsed.suffix);
                }
                else
                    return "Not a command";
            }
            else
                throw new Error("No Client found. Make sure your Client.modules.register() is after Client.login()");
        };
    }
}
//# sourceMappingURL=Module.js.map