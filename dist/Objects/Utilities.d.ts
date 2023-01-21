import { IBaseInteractionComponent, IChironModule } from "../Headers/Module";
import { IModuleManagerRegisterable } from "../Headers/ModuleManager";
import { IChironClient } from "../Headers/Client";
export declare function readdirSyncRecursive(Directory: string): Array<string>;
export declare function registerInteractions(client: IChironClient, ApplicationAndContextMenuCommands: Array<IBaseInteractionComponent>): Promise<any>;
export declare function resolveRegisterable(registerable: IModuleManagerRegisterable): Promise<Array<IChironModule>>;
