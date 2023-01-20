import { IChironModule } from "../Headers/Module";
import { IModuleManager, IModuleManagerRegisterable } from "../Headers/ModuleManager";
import { IChironClient } from "../Headers/Client";
import { BaseInteractionComponent, EventComponent, MessageCommandComponent, ScheduleComponent } from "./Module";
export declare class ModuleManager extends Array<IChironModule> implements IModuleManager {
    client: IChironClient;
    applicationCommands: Array<BaseInteractionComponent>;
    events: Array<EventComponent>;
    messageCommands: Array<MessageCommandComponent>;
    scheduledJobs: Array<ScheduleComponent>;
    constructor(ChironClient: IChironClient);
    register(registerable?: IModuleManagerRegisterable): Promise<IModuleManager>;
    unregister(registerable?: IModuleManagerRegisterable): Promise<IModuleManager>;
    reload(registerable?: IModuleManagerRegisterable): IModuleManager;
}
