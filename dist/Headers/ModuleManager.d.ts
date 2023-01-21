import { Client } from "discord.js";
import { IBaseInteractionComponent, IChironModule, IEventComponent, IMessageCommandComponent, IScheduleComponent } from "./Module";
export interface IModuleManager extends Array<IChironModule> {
    client: Client;
    applicationCommands: Array<IBaseInteractionComponent>;
    events: Array<IEventComponent>;
    messageCommands: Array<IMessageCommandComponent>;
    scheduledJobs: Array<IScheduleComponent>;
    register: IModuleManagerRegisterFunction;
    unregister: any;
    reload: IModuleManagerRegisterFunction;
}
export interface IModuleManagerRegisterFunction {
    (registerable?: IModuleManagerRegisterable): Promise<IModuleManager> | IModuleManager;
}
export interface IModuleManagerRegisterable {
    registerable: Array<IChironModule> | IChironModule | string | Array<string> | null;
}
