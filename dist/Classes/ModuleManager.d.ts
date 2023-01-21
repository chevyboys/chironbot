import { IChironModule } from "../Headers/Module";
import { IModuleManager, IModuleManagerRegisterable } from "../Headers/ModuleManager";
import { IChironClient } from "../Headers/Client";
import { Collection } from "discord.js";
import { BaseInteractionComponent, EventComponent, MessageCommandComponent, ScheduleComponent } from "./Module";
export declare class ModuleManager extends Array<IChironModule> implements IModuleManager {
    client: IChironClient;
    applicationCommands: Array<BaseInteractionComponent>;
    events: Array<EventComponent>;
    messageCommands: Array<MessageCommandComponent>;
    scheduledJobs: Array<ScheduleComponent>;
    constructor(ChironClient: IChironClient);
    private remove;
    register(registerable?: IModuleManagerRegisterable): Promise<IModuleManager>;
    unregister(registerable?: IModuleManagerRegisterable): Promise<Collection<unknown, unknown>>;
    reload(registerable?: IModuleManagerRegisterable): IModuleManager;
}
