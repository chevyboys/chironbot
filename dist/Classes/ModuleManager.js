import fs from "fs";
import path from "path";
import { Collection, Events } from "discord.js";
import { BaseInteractionComponent, ChironModule, ContextMenuCommandComponent, EventComponent, MessageCommandComponent, MessageComponentInteractionComponent, ModuleLoading, ModuleUnloading, ScheduleComponent, SlashCommandComponent } from "./Module";
import * as Schedule from "node-schedule";
function readdirSyncRecursive(Directory) {
    let Files = [];
    const commandPath = path.resolve(process.cwd(), Directory);
    fs.readdirSync(commandPath).forEach(File => {
        const Absolute = path.join(commandPath, File);
        if (fs.statSync(Absolute).isDirectory())
            return readdirSyncRecursive(Absolute);
        else
            return Files.push(Absolute);
    });
    if (Files.length == 0)
        throw new Error("No files found in " + Directory);
    else
        return Files;
}
async function registerInteractions(client, ApplicationAndContextMenuCommands) {
    if (client.user) {
        let commandsToRegister = ApplicationAndContextMenuCommands.map((ChironModuleComponentBaseInteraction) => ChironModuleComponentBaseInteraction.builder.toJSON());
        try {
            console.log(`Started refreshing ${commandsToRegister.length} application (/) commands.`);
            // Register all commands as guild commands in the test guild if Debug is enabled. Else, register all commands as global
            let commandData;
            if (client.config.DEBUG) {
                commandData = await client.application?.commands.set(commandsToRegister, client.config.adminServer);
            }
            else
                commandData = await client.application?.commands.set(commandsToRegister);
            console.log(commandData);
            console.log(`Successfully reloaded ${commandData?.size} application (/) commands.`);
            return commandData;
        }
        catch (error) {
            // And of course, make sure you catch and log any errors!
            throw error;
        }
    }
}
async function resolveRegisterable(registerable) {
    if ((registerable instanceof String || typeof registerable == "string") || (Array.isArray(registerable) && registerable[0] && (typeof registerable[0] == "string" || registerable instanceof String))) {
        let parsedRegisterable;
        if ((Array.isArray(registerable)))
            parsedRegisterable = registerable[0];
        else
            parsedRegisterable = registerable;
        let possibleModules = readdirSyncRecursive(parsedRegisterable);
        //once we have all possible modules, filter them for only what is acutally a module. This allows us to export different things for tests
        let modules = await Promise.all(possibleModules.filter(file => file.endsWith('.js'))
            .map(async (moduleFile) => {
            return import(moduleFile);
        }));
        let filteredModules = modules.map(m => {
            let mod = m.Module ? m.Module : m.module ? m.module : m.command ? m.command : m.Command ? m.Command : m;
            return mod;
        }).filter((possibleModule) => possibleModule instanceof ChironModule);
        return filteredModules;
    }
    else if (Array.isArray(registerable)) {
        if (registerable.length < 1) {
            throw new Error("Cannot resolve empty array of Modules to registerable the Module");
        }
        else if (!(registerable[0] instanceof ChironModule)) {
            throw new Error("Cannot resolve unknown object type to registerable Module");
        }
        else
            return registerable;
    }
    else if (registerable instanceof ChironModule) {
        return [registerable];
    }
    else {
        throw new Error("Cannot resolve unknown object type to registerable object");
    }
    throw new Error("Unreachable state reached. How did you do this?");
}
export class ModuleManager extends Array {
    client;
    applicationCommands = [];
    events = [];
    messageCommands = [];
    scheduledJobs = [];
    constructor(ChironClient) {
        super();
        this.client = ChironClient;
    }
    remove(Array, item) {
        let index = Array.indexOf(item);
        if (index !== -1) {
            Array.splice(index, 1);
        }
    }
    ;
    async register(registerable) {
        let modules;
        if (!registerable) {
            modules = await resolveRegisterable(this.client.modulePath);
        }
        else {
            modules = await resolveRegisterable(registerable);
        }
        //take care of onInit functions, and register commands to discord
        for (const module of modules) {
            module.client = this.client;
            this.push(module);
            for (const component of module.components) {
                if (component.enabled) {
                    component.module = module;
                    if (component instanceof BaseInteractionComponent) {
                        this.applicationCommands.push(component);
                    }
                    else if (component instanceof ModuleLoading) {
                        component.process(null);
                    }
                    else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            this.client.on(Events.MessageCreate, (input) => { component.exec(input); });
                            this.client.on(Events.MessageUpdate, (input) => { component.exec(input); });
                            this.messageCommands.push(component);
                        }
                        else if (!(component instanceof MessageComponentInteractionComponent)) {
                            this.client.on(component.trigger, (input) => { component.exec(input); });
                            this.events.push(component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        component.job = Schedule.scheduleJob(component.module?.name || component.module?.file || "unknown", component.chronSchedule, component.exec);
                        this.scheduledJobs.push(component);
                    }
                }
            }
        }
        await registerInteractions(this.client, this.applicationCommands);
        console.log("Successfully Registered " + this.events.length + " Events:\n");
        console.dir(this.events);
        console.log("Successfully Registered " + this.messageCommands + " Message Commands\n");
        console.dir(this.messageCommands.map((messageCommand) => {
            return {
                name: messageCommand.name,
                description: messageCommand.description,
                category: messageCommand.category,
                enabled: messageCommand.enabled,
                permissions: messageCommand.permissions,
                process: messageCommand.process
            };
        }));
        this.client.on(Events.InteractionCreate, (interaction) => {
            //Handle receiving command interactions
            //find any matching interactions
            (() => {
                let match = null;
                let module = this.find(module => {
                    return module.components.filter(c => c.enabled).find((c) => {
                        if (((interaction.isChatInputCommand() && c instanceof SlashCommandComponent)
                            || (interaction.isContextMenuCommand() && c instanceof ContextMenuCommandComponent))
                            && interaction.commandName == c.name) {
                            match = c;
                            return true;
                        }
                        else if (interaction.isMessageComponent() && c instanceof MessageComponentInteractionComponent && c.customId(interaction["customId"])) {
                            match = c;
                            return true;
                        }
                        else
                            return false;
                    });
                });
                if (match && match instanceof SlashCommandComponent || match instanceof ContextMenuCommandComponent || match instanceof MessageComponentInteractionComponent) {
                    match.exec(interaction);
                }
                else {
                    if (interaction.isRepliable())
                        interaction.reply("I don't know how to handle that!");
                    else
                        throw new Error("I don't know how to handle that!");
                }
            })();
        });
        return this;
    }
    async unregister(registerable) {
        let modules;
        let stored = new Collection();
        if (!registerable) {
            modules = await resolveRegisterable(this.client.modulePath);
        }
        else {
            modules = await resolveRegisterable(registerable);
        }
        //take care of onInit functions, and register commands to discord
        for (const module of modules) {
            let unregisterComponent = module.components.find(c => c instanceof ModuleUnloading);
            if (unregisterComponent) {
                let result = unregisterComponent.exec(null);
                stored.set(module.name, result);
            }
            this.remove(this, module);
            for (const component of module.components) {
                if (component.enabled) {
                    component.module = module;
                    if (component instanceof BaseInteractionComponent) {
                        this.remove(this.applicationCommands, component);
                    }
                    else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            this.client.removeListener(Events.MessageCreate, (input) => { component.exec(input); });
                            this.client.removeListener(Events.MessageUpdate, (input) => { component.exec(input); });
                            this.remove(this.messageCommands, component);
                        }
                        else if (!(component instanceof MessageComponentInteractionComponent)) {
                            this.client.removeListener(component.trigger, (input) => { component.exec(input); });
                            this.remove(this.events, component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        let job = this.scheduledJobs.find(j => j == component)?.job;
                        if (job) {
                            job.cancel();
                            this.remove(this.scheduledJobs, component);
                        }
                    }
                }
            }
        }
        //Since the commands have been removed from this.applicationCommands, we should be able to just re-register all the commands with a set.
        await registerInteractions(this.client, this.applicationCommands);
        return stored;
    }
    reload(registerable) {
        //toDo
        return this;
    }
}
//# sourceMappingURL=ModuleManager.js.map