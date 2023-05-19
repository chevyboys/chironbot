import { Client, Collection } from "discord.js";
import { IEventHandlerCollection } from "./EventHandler";
import { IBaseInteractionComponent, IChironModule, IMessageCommandComponent, IScheduleComponent } from "./Module";
export interface IModuleManager extends Collection<string, IChironModule> {
    client: Client;
    applicationCommands: Collection<string, IBaseInteractionComponent>;
    events: IEventHandlerCollection;
    messageCommands: Collection<string, IMessageCommandComponent>;
    scheduledJobs: Collection<string, IScheduleComponent>;
    register: IModuleManagerRegisterFunction;
    unregister: IModuleManagerRegisterFunction;
    reload: IModuleManagerRegisterFunction;
}
export interface IModuleManagerRegisterFunction {
    (registerable?: IModuleManagerRegisterable): Promise<Collection<string, object>>;
}
export type IModuleManagerRegisterable = Array<IChironModule> | IChironModule | string | Array<string> | null;
