import { IBaseInteractionComponent, IChironModule } from "../Headers/Module";
import { IModuleManagerRegisterable } from "../Headers/ModuleManager";
import fs from "fs";
import path from "path";
import { IChironClient } from "../Headers/Client";
import { ApplicationCommand, Collection, Snowflake } from "discord.js";
import { ChironModule } from "../Classes/Module";


export function readdirSyncRecursive(Directory: string): Array<string> {
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

export async function registerInteractions(client: IChironClient, ApplicationAndContextMenuCommands: Array<IBaseInteractionComponent>) {
    if (client.user) {
        let commandsToRegister = ApplicationAndContextMenuCommands.map((ChironModuleComponentBaseInteraction) => ChironModuleComponentBaseInteraction.builder.toJSON());

        try {
            console.log(`Started refreshing ${commandsToRegister.length} application (/) commands.`);
            // Register all commands as guild commands in the test guild if Debug is enabled. Else, register all commands as global
            let commandData: Collection<Snowflake, ApplicationCommand> | any;
            if (client.config.DEBUG) {
                commandData = await client.application?.commands.set(commandsToRegister, client.config.adminServer);
            }
            else commandData = await client.application?.commands.set(commandsToRegister);
            console.log(commandData)
            console.log(`Successfully reloaded ${commandData?.size} application (/) commands.`);

            return commandData;
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            throw error
        }
    }
}
export async function resolveRegisterable(registerable: IModuleManagerRegisterable): Promise<Array<IChironModule>> {
    if ((registerable instanceof String || typeof registerable == "string") || (Array.isArray(registerable) && registerable[0] && (typeof registerable[0] == "string" || registerable instanceof String))) {
        let parsedRegisterable;
        if ((Array.isArray(registerable))) parsedRegisterable = registerable[0];
        else parsedRegisterable = registerable;
        let possibleModules =
            readdirSyncRecursive(parsedRegisterable as unknown as string)
        //once we have all possible modules, filter them for only what is acutally a module. This allows us to export different things for tests
        let modules = await Promise.all(possibleModules.filter(file => file.endsWith('.js'))
            .map(async (moduleFile) => {
                return import(moduleFile);
            }))
        let filteredModules = modules.map(m => {
            let mod = m.Module ? m.Module : m.module ? m.module : m.command ? m.command : m.Command ? m.Command : m;
            return mod;
        }
        ).filter((possibleModule) => possibleModule instanceof ChironModule);
        return filteredModules;

    } else if (Array.isArray(registerable)) {
        if (registerable.length < 1) {
            throw new Error("Cannot resolve empty array of Modules to registerable the Module");
        }
        else if (!(registerable[0] instanceof ChironModule)) {
            throw new Error("Cannot resolve unknown object type to registerable Module");
        }
        else return [registerable[0]]
    } else if (registerable instanceof ChironModule) {
        return [registerable]
    }
    else {
        throw new Error("Cannot resolve unknown object type to registerable object");


    }
    throw new Error("Unreachable state reached. How did you do this?");
}