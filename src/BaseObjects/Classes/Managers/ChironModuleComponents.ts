import { REST, Routes, Collection} from "discord.js";
import fs from "fs";
import { ChironModuleComponentBaseInteraction } from "../ChironModuleComponents/ChironModuleComponent.InteractionBase";
import path from "path";
import { ChironModule } from "../ChironModule";
import { ChironClient } from "../ChironClient";


function readdirSyncRecursive(Directory: string): Array<string> {
    let Files: Array<string> = [];
    fs.readdirSync(Directory).forEach(File => {
        const Absolute = path.join(Directory, File);
        if (fs.statSync(Absolute).isDirectory()) return readdirSyncRecursive(Absolute);
        else return Files.push(Absolute);
    });
    throw new Error("No files found in " + Directory);

}

//Handles the registration with discord
async function registerInteractions(client: ChironClient, ApplicationAndContextMenuCommands: Collection<string, ChironModuleComponentBaseInteraction>) {
    if (client.user) {
        let clientUserId: string = client.user.id;
        const rest = new REST({ version: '10' }).setToken(client.config.token);
        let commandsToRegister = ApplicationAndContextMenuCommands.map((ChironModuleComponentBaseInteraction) => ChironModuleComponentBaseInteraction.builder.toJSON());

        try {
            console.log(`Started refreshing ${commandsToRegister.length} application (/) commands.`);
              // Register all commands as guild commands in the test guild if Debug is enabled. Else, register all commands as global
            const Route = client.DEBUG ?
                Routes.applicationGuildCommands(clientUserId, client.config.adminServer) :
                Routes.applicationCommands(clientUserId)

                const data: any = await rest.put(
                    Route,
                    { body: commandsToRegister },
                );



            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            return data;
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }


    }
}

export class ChironModuleComponentObject {
    ApplicationCommmands: Collection<string, ChironModuleComponentBaseInteraction> = new Collection;
    //Todo: Events: Collection<string, ChironEvents>
    //Todo: Clockwork: Collection<string, ChironClockwork>

    //registers all module components to the various component collections,
    async register(filepath: string, client: ChironClient) {
        //Wait for attempted importing of all possible modules
        return Promise.all(
            readdirSyncRecursive(filepath).filter(file => file.endsWith('.ts'))
                .map(async (moduleFile) => {
                    return import(moduleFile)
                })
            //once we have all possible modules, filter them for only what is acutally a module. This allows us to export different things for tests
        ).then(async (possibleModules) => {
            let modules = possibleModules.filter(
                (possibleModule) => possibleModule instanceof ChironModule
            )
            for (const module of modules) {
                for (const component of module.components) {
                    if (component instanceof ChironModuleComponentBaseInteraction) {
                        this.ApplicationCommmands.set(component.name, component);
                        
                    } else {
                        //todo: impliment setting for events and clockwork
                    }

                }
            }
            await registerInteractions(client, this.ApplicationCommmands);
        })

    }

}