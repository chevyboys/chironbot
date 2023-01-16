import { IBaseInteractionComponent, IChironModule } from "../Headers/Module";
import { IModuleManager, IModuleManagerRegisterable } from "../Headers/ModuleManager";
import fs from "fs";
import path from "path";
import { IChironClient } from "../Headers/Client";
import { ApplicationCommand, Collection, Events, Interaction, MessageComponentInteraction, Snowflake } from "discord.js";
import { BaseInteractionComponent, ChironModule, ContextMenuCommandComponent, EventComponent, MessageComponentInteractionComponent, ModuleLoading, SlashCommandComponent } from "./Module/Module";


function readdirSyncRecursive(Directory: string): Array<string> {
    let Files: Array<string> = [];
    const commandPath = path.resolve(process.cwd(), Directory)
    fs.readdirSync(commandPath).forEach(File => {
        const Absolute = path.join(commandPath, File);
        if (fs.statSync(Absolute).isDirectory()) return readdirSyncRecursive(Absolute);
        else return Files.push(Absolute);
    });
    if (Files.length == 0)
        throw new Error("No files found in " + Directory);
    else return Files;

}

async function registerInteractions(client: IChironClient, ApplicationAndContextMenuCommands: Array<IBaseInteractionComponent>) {
    if (client.user) {
        let commandsToRegister = ApplicationAndContextMenuCommands.map((ChironModuleComponentBaseInteraction) => ChironModuleComponentBaseInteraction.builder.toJSON());

        try {
            console.log(`Started refreshing ${commandsToRegister.length} application (/) commands.`);
            // Register all commands as guild commands in the test guild if Debug is enabled. Else, register all commands as global
            let commandData: Collection<Snowflake, ApplicationCommand> | any;
            if (client.DEBUG) {
                commandData = await client.application?.commands.set(commandsToRegister, client.config.adminServer);
            }
            else commandData = await client.application?.commands.set(commandsToRegister);

            console.log(`Successfully reloaded ${commandData?.size} application (/) commands.`);
            return commandData;
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            throw error
        }
        finally {
            return null;
        }
    }
}
//testing
async function resolveRegisterable(registerable: IModuleManagerRegisterable): Promise<Array<IChironModule>> {
    if ((registerable instanceof String || typeof registerable == "string") || (Array.isArray(registerable) && registerable[0] && (typeof registerable[0] == "string" || registerable instanceof String))) {
        let parsedRegisterable;
        if ((Array.isArray(registerable))) parsedRegisterable = registerable[0];
        else parsedRegisterable = registerable;
        let possibleModules =
            readdirSyncRecursive(parsedRegisterable as unknown as string)
        //once we have all possible modules, filter them for only what is acutally a module. This allows us to export different things for tests
        let modules = await Promise.all(possibleModules.filter(file => file.endsWith('.js'))
            .map(async (moduleFile) => {
                try {
                    let possibleMod = (await import(moduleFile))?.Module;
                    possibleMod.file = moduleFile
                    return possibleMod;
                } catch (error) {
                    throw new Error(`Error in Module Import for:"${moduleFile}"`);
                }
            }).filter(
                (possibleModule) => possibleModule instanceof ChironModule
            ))
        return modules;

    } else if (Array.isArray(registerable)) {
        if (registerable.length < 1) {
            throw new Error("Cannot resolve empty array of Modules to registerable the Module");
        }
        else if (!(registerable[0] instanceof ChironModule)) {
            throw new Error("Cannot resolve unknown object type to registerable Module");
        }
        else return registerable
    } else if (registerable instanceof ChironModule) {
        return [registerable]
    }
    else {
        throw new Error("Cannot resolve unknown object type to registerable object");


    }
    throw new Error("Unreachable state reached. How did you do this?");
}

export class ModuleManager extends Array<IChironModule> implements IModuleManager {
    client: IChironClient;
    constructor(ChironClient: IChironClient) {
        super()
        this.client = ChironClient
    }


    async register(registerable?: IModuleManagerRegisterable): Promise<IModuleManager> {
        let modules: Array<IChironModule>;
        if (!registerable) {
            modules = await resolveRegisterable(this.client.modulePath as unknown as IModuleManagerRegisterable)
        } else {
            modules = await resolveRegisterable(registerable)
        }

        //take care of onInit functions, and register commands to discord
        let applicationCommands: Array<BaseInteractionComponent> = [];
        for (const module of modules) {
            module.client = this.client;
            this.push(module)
            for (const component of module.components) {
                if (component.enabled) {
                    if (component instanceof BaseInteractionComponent) {
                        applicationCommands.push(component);
                    } else if (component instanceof ModuleLoading) {
                        component.process(null);
                    } else if (component instanceof EventComponent) {
                        this.client.on(component.trigger, (input) => { component.exec(input) })
                    }
                }


            }
        }
        await registerInteractions(this.client, applicationCommands);


        this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
            //Handle receiving command interactions

            //find any matching interactions
            (() => {
                let match: any = null;
                let module = this.find(module => {
                    return module.components.filter(c => c.enabled).find((c) => {
                        if (
                            (
                                (interaction.isChatInputCommand() && c instanceof SlashCommandComponent)
                                || (interaction.isContextMenuCommand() && c instanceof ContextMenuCommandComponent)
                            )
                            && interaction.commandName == c.name
                        ) {
                            match = c;

                            return true;
                        } else if (interaction.isMessageComponent() && c instanceof MessageComponentInteractionComponent && c.customId(interaction["customId"])) {
                            match = c;
                            return true;
                        }
                        else return false;
                    })
                })
                if (match && match instanceof SlashCommandComponent || match instanceof ContextMenuCommandComponent || match instanceof MessageComponentInteractionComponent) match.exec(interaction);
                else {
                    throw new Error("I don't know how to handle that!");
                }
            })()



        })


        return this;
    }
    async unregister(registerable?: IModuleManagerRegisterable): Promise<IModuleManager> {
        //toDo

        return this;
    }
    reload(registerable?: IModuleManagerRegisterable): IModuleManager {
        //toDo

        return this;
    }

}