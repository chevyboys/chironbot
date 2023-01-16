import { Client } from "discord.js";
import { IChironModule } from "./Module";
export interface IModuleManager extends Array<IChironModule> {
    client: Client;
    register: IModuleManagerRegisterFunction;
    unregister: IModuleManagerRegisterFunction;
    reload: IModuleManagerRegisterFunction;
}
export interface IModuleManagerRegisterFunction {
    (registerable?: IModuleManagerRegisterable): Promise<IModuleManager> | IModuleManager;
}
export interface IModuleManagerRegisterable {
    registerable: Array<IChironModule> | IChironModule | string | Array<string> | null;
}
