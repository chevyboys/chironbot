import { SlashCommandBuilder, ContextMenuCommandBuilder, Events } from "discord.js";
import { customIdFunction, IBaseComponent, IBaseComponentOptions, IBaseExecFunction, IBaseInteractionComponent, IBaseInteractionComponentOption, IBaseProcessFunction, IChironModule, IChironModuleOptions, IClockworkComponent, IContextMenuCommandComponent, IContextMenuCommandComponentOptions, IEventComponent, IEventComponentOptions, IEventProcessFunction, IInteractionPermissionsFunction, IInteractionProcessFunction, IMessageComponentInteractionComponentOptions, IModuleLoading, ISlashCommandComponent, ISlashCommandComponentOptions } from "../../Headers/Module";
import { ChironClient } from "../ChironClient";
export declare class ChironModule implements IChironModule {
    name: string;
    components: Array<IBaseComponent>;
    client?: ChironClient;
    file?: string;
    constructor(ModuleOptions: IChironModuleOptions);
}
export declare class BaseComponent implements IBaseComponent {
    readonly enabled: boolean;
    readonly process: IBaseProcessFunction;
    module?: IChironModule;
    exec: IBaseExecFunction;
    constructor(BaseComponentOptions: IBaseComponentOptions);
}
export declare class BaseInteractionComponent extends BaseComponent implements IBaseInteractionComponent {
    readonly name: string;
    description: string;
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction;
    constructor(BaseInteractionComponentOptions: IBaseInteractionComponentOption);
}
export declare class SlashCommandComponent extends BaseInteractionComponent implements ISlashCommandComponent {
    readonly builder: SlashCommandBuilder;
    constructor(SlashCommandComponentOptions: ISlashCommandComponentOptions);
}
export declare class ContextMenuCommandComponent extends BaseInteractionComponent implements IContextMenuCommandComponent {
    readonly builder: ContextMenuCommandBuilder;
    readonly description: string;
    constructor(ContextMenuCommandComponentOptions: IContextMenuCommandComponentOptions);
}
export declare class EventComponent extends BaseComponent implements IEventComponent {
    readonly trigger: Events | any;
    process: IEventProcessFunction;
    constructor(EventComponentOptions: IEventComponentOptions);
}
export declare class MessageComponentInteractionComponent extends EventComponent implements IEventComponent {
    customId: customIdFunction;
    process: IInteractionProcessFunction;
    constructor(MessageComponentInteractionComponentOptions: IMessageComponentInteractionComponentOptions);
}
export declare class ClockworkComponent extends BaseComponent implements IClockworkComponent {
    readonly interval: number;
    constructor(ClockworkComponentOptions: any);
}
export declare class ModuleLoading extends BaseComponent implements IModuleLoading {
}
export declare class ModuleUnloading extends BaseComponent {
}
