import { IChironModule } from "../Headers/Module";
import { IModuleManager, IModuleManagerRegisterable } from "../Headers/ModuleManager";
import { IChironClient } from "../Headers/Client";
import { Events, Interaction, } from "discord.js";
import { BaseInteractionComponent, ContextMenuCommandComponent, EventComponent, MessageCommandComponent, MessageComponentInteractionComponent, ModuleLoading, ScheduleComponent, SlashCommandComponent } from "./Module";
import * as Schedule from "node-schedule";
import { registerInteractions, resolveRegisterable } from "../Objects/Utilities";




export class ModuleManager extends Array<IChironModule> implements IModuleManager {
    client: IChironClient;
    applicationCommands: Array<BaseInteractionComponent> = [];
    events: Array<EventComponent> = [];
    messageCommands: Array<MessageCommandComponent> = [];
    scheduledJobs: Array<ScheduleComponent> = [];


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


        for (const module of modules) {
            module.client = this.client;
            this.push(module)
            for (const component of module.components) {
                if (component.enabled) {
                    component.module = module;
                    if (component instanceof BaseInteractionComponent) {
                        this.applicationCommands.push(component);
                    } else if (component instanceof ModuleLoading) {
                        component.process(null);
                    } else if (component instanceof EventComponent) {
                        if (component instanceof MessageCommandComponent) {
                            this.client.on(Events.MessageCreate, (input) => { component.exec(input) })
                            this.client.on(Events.MessageUpdate, (input) => { component.exec(input) })
                            this.messageCommands.push(component);
                        } else if (!(component instanceof MessageComponentInteractionComponent)) {
                            this.client.on(component.trigger, (input) => { component.exec(input) })
                            this.events.push(component);
                        }
                    }
                    else if (component instanceof ScheduleComponent) {
                        component.job = Schedule.scheduleJob(component.module?.name || component.module?.file || "unknown", component.chronSchedule, component.exec)
                        this.scheduledJobs.push(component);

                    }
                }


            }
        }
        await registerInteractions(this.client, this.applicationCommands);
        console.log("Successfully Registered " + this.events.length + " Events:\n");
        console.dir(this.events)
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
        }))

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
                if (match && match instanceof SlashCommandComponent || match instanceof ContextMenuCommandComponent || match instanceof MessageComponentInteractionComponent) { match.exec(interaction); }
                else {
                    if (interaction.isRepliable()) interaction.reply("I don't know how to handle that!")
                    else throw new Error("I don't know how to handle that!");
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