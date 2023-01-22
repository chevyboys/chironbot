import { IChironModule } from "../Headers/Module";
import { IModuleManager, IModuleManagerRegisterable } from "../Headers/ModuleManager";
import { IChironClient } from "../Headers/Client";
import { Collection } from "discord.js";
import { BaseInteractionComponent, MessageCommandComponent, ScheduleComponent } from "./Module";
import { EventHandlerCollection } from "./EventHandler";
export declare class ModuleManager extends Collection<string, IChironModule> implements IModuleManager {
    client: IChironClient;
    applicationCommands: Collection<string, BaseInteractionComponent>;
    events: EventHandlerCollection;
    messageCommands: Collection<string, MessageCommandComponent>;
    scheduledJobs: Collection<string, ScheduleComponent>;
    constructor(ChironClient: IChironClient);
    register: (registerable?: IModuleManagerRegisterable) => Promise<IModuleManager>;
    private registerPrivate;
    unregister(registerable?: IModuleManagerRegisterable): Promise<Collection<string, any>>;
    reload(registerable?: IModuleManagerRegisterable): Promise<IModuleManager>;
}
