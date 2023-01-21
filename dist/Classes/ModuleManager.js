import fs from "fs";
import path from "path";
import { Collection, Events } from "discord.js";
import { BaseInteractionComponent, ChironModule, ContextMenuCommandComponent, EventComponent, MessageCommandComponent, MessageComponentInteractionComponent, ModuleLoading, ModuleUnloading, ScheduleComponent, SlashCommandComponent } from "./Module";
import * as Schedule from "node-schedule";
import { EventHandlerCollection } from "./EventHandler";
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
        let GlobalCommandsToRegister = ApplicationAndContextMenuCommands.filter(component => !component.guildId).map((ChironModuleComponentBaseInteraction) => ChironModuleComponentBaseInteraction.builder.toJSON());
        let GuildCommandsToRegister = new Collection();
        ApplicationAndContextMenuCommands.filter(component => component.guildId != undefined).forEach((ChironModuleComponentBaseInteraction) => {
            if (!GuildCommandsToRegister.has(ChironModuleComponentBaseInteraction.guildId)) {
                GuildCommandsToRegister.set(ChironModuleComponentBaseInteraction.guildId, []);
            }
            GuildCommandsToRegister.get(ChironModuleComponentBaseInteraction.guildId)?.push(ChironModuleComponentBaseInteraction.builder.toJSON());
        });
        try {
            console.log(`Started refreshing ${GlobalCommandsToRegister.length} global application (/) command${GlobalCommandsToRegister.length > 1 ? 's' : ''}, and Guild commands in ${GuildCommandsToRegister.size} guild${GuildCommandsToRegister.size > 1 ? 's' : ''}.`);
            // Register all commands as guild commands in the test guild if Debug is enabled. Else, register all commands as global
            let commandData = new Collection;
            for (const [guild, value] of GuildCommandsToRegister) {
                let data = await client.application?.commands.set(value, guild);
                if (data && data.size > 0)
                    commandData = commandData.concat(data);
            }
            let data = await client.application?.commands.set(GlobalCommandsToRegister);
            if (data)
                commandData = commandData.concat(data);
            console.log(commandData);
            console.log(`Successfully reloaded ${commandData?.size} application (/) commands.`);
            return commandData;
        }
        catch (error) {
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
export class ModuleManager extends Collection {
    client;
    applicationCommands = new Collection();
    events = new EventHandlerCollection();
    messageCommands = new Collection();
    scheduledJobs = new Collection();
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
    async register(registerable, storedValues) {
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
            if (this.has(module.name))
                throw new Error("Module name " + module.name + " Must be unique!");
            this.set(module.name, module);
            for (const component of module.components) {
                if (component.enabled) {
                    component.module = module;
                    if (component instanceof BaseInteractionComponent) {
                        if (this.client.config.DEBUG) {
                            component.guildId = this.client.config.adminServer;
                        }
                        this.applicationCommands.set(component.name, component);
                    }
                    else if (component instanceof ModuleLoading) {
                        component.process(storedValues?.get(component.module.name));
                    }
                    else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            this.events.add(this.client, component);
                            component.trigger = Events.MessageUpdate;
                            this.events.add(this.client, component);
                            this.messageCommands.set(component.name, component);
                        }
                        else {
                            this.events.add(this.client, component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        component.job = Schedule.scheduleJob(component.module?.name || component.module?.file || "unknown", component.chronSchedule, component.exec);
                        let i = 0;
                        while (this.scheduledJobs.has(`${component.module?.name}Scheduled${i}`)) {
                            i++;
                        }
                        this.scheduledJobs.set(`${component.module?.name}Scheduled${i}`, component);
                    }
                }
            }
        }
        await registerInteractions(this.client, this.applicationCommands.map((value, key) => value));
        console.log("\nSuccessfully Registered " + this.events.size + " Events:");
        console.dir(this.events);
        console.log("\nSuccessfully Registered " + this.messageCommands.size + " Message Commands");
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
            this.delete(module.name);
            for (const component of module.components) {
                if (component.enabled) {
                    if (component instanceof BaseInteractionComponent) {
                        this.applicationCommands.delete(component.name);
                    }
                    else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            component.trigger = Events.MessageCreate;
                            this.events.remove(component);
                            component.trigger = Events.MessageUpdate;
                            this.events.remove(component);
                        }
                        else if (!(component instanceof MessageComponentInteractionComponent)) {
                            this.events.remove(component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        let job = this.scheduledJobs.find(j => j == component)?.job;
                        if (job) {
                            job.cancel();
                        }
                    }
                }
            }
            this.scheduledJobs = this.scheduledJobs.filter(comp => comp.module?.name != module.name);
        }
        //Since the commands have been removed from this.applicationCommands, we should be able to just re-register all the commands with a set.
        await registerInteractions(this.client, this.applicationCommands.map((v, k) => v));
        return stored;
    }
    async reload(registerable) {
        //toDo
        let stored = await this.unregister(registerable);
        return await (this.register(registerable, stored));
    }
}
//# sourceMappingURL=ModuleManager.js.map