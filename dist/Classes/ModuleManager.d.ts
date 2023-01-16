import { IChironModule } from "../Headers/Module";
import { IModuleManager, IModuleManagerRegisterable } from "../Headers/ModuleManager";
import { IChironClient } from "../Headers/Client";
export declare class ModuleManager extends Array<IChironModule> implements IModuleManager {
    client: IChironClient;
    constructor(ChironClient: IChironClient);
    register(registerable?: IModuleManagerRegisterable): Promise<IModuleManager>;
    unregister(registerable?: IModuleManagerRegisterable): Promise<IModuleManager>;
    reload(registerable?: IModuleManagerRegisterable): IModuleManager;
}
