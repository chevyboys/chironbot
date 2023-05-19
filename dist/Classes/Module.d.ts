import { SlashCommandBuilder, ContextMenuCommandBuilder, Events } from "discord.js";
import { customIdFunction, IBaseComponent, IBaseComponentOptions, IBaseExecFunction, IBaseInteractionComponent, IBaseInteractionComponentOption, IBaseProcessFunction, IChironModule, IChironModuleOptions, IScheduleComponent, IContextMenuCommandComponent, IContextMenuCommandComponentOptions, IEventComponent, IEventComponentOptions, IEventProcessFunction, IInteractionPermissionsFunction, IInteractionProcessFunction, IMessageCommandComponent, IMessageCommandComponentOptions, IMessageCommandPermissionsFunction, IMessageCommandProcessFunction, IMessageComponentInteractionComponent, IMessageComponentInteractionComponentOptions, IModuleOnLoadComponent, ISlashCommandComponent, ISlashCommandComponentOptions, IScheduleComponentOptions } from "../Headers/Module";
import { ChironClient } from "./ChironClient";
import * as Schedule from 'node-schedule';
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
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction;
    guildId?: string | undefined;
    constructor(BaseInteractionComponentOptions: IBaseInteractionComponentOption);
}
export declare class SlashCommandComponent extends BaseInteractionComponent implements ISlashCommandComponent {
    readonly builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    constructor(SlashCommandComponentOptions: ISlashCommandComponentOptions);
}
export declare class ContextMenuCommandComponent extends BaseInteractionComponent implements IContextMenuCommandComponent {
    readonly builder: ContextMenuCommandBuilder;
    readonly description: string;
    constructor(ContextMenuCommandComponentOptions: IContextMenuCommandComponentOptions);
}
export declare class EventComponent extends BaseComponent implements IEventComponent {
    trigger: Events | string;
    process: IEventProcessFunction;
    constructor(EventComponentOptions: IEventComponentOptions);
}
export declare class MessageComponentInteractionComponent extends EventComponent implements IMessageComponentInteractionComponent {
    customId: customIdFunction;
    process: IInteractionProcessFunction;
    permissions: IInteractionPermissionsFunction;
    constructor(MessageComponentInteractionComponentOptions: IMessageComponentInteractionComponentOptions);
}
export declare class ScheduleComponent extends BaseComponent implements IScheduleComponent {
    readonly chronSchedule: string;
    job?: Schedule.Job;
    exec: Schedule.JobCallback;
    constructor(ScheduleComponentOptions: IScheduleComponentOptions);
}
export declare class ModuleOnLoadComponent extends BaseComponent implements IModuleOnLoadComponent {
}
export declare class ModuleOnUnloadComponent extends BaseComponent {
}
export declare class MessageCommandComponent extends EventComponent implements IMessageCommandComponent {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly permissions: IMessageCommandPermissionsFunction;
    process: IMessageCommandProcessFunction;
    constructor(MessageCommandOptions: IMessageCommandComponentOptions);
}
