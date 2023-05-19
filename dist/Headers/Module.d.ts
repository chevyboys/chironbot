import { Client, CommandInteraction, ContextMenuCommandBuilder, Events, Interaction, Message, SlashCommandBuilder, Snowflake } from "discord.js";
import * as Schedule from "node-schedule";
export interface IChironModuleOptions {
    readonly name?: string;
    readonly file?: string;
    components: Array<IBaseComponent>;
    client?: Client;
}
export interface IChironModule {
    readonly name: string;
    file?: string;
    components: Array<IBaseComponent>;
    client?: Client;
}
export interface IBaseComponentOptions {
    readonly enabled: boolean;
    readonly process: IBaseProcessFunction;
    module?: IChironModule;
}
export interface IBaseComponent {
    readonly enabled: boolean;
    readonly process: IBaseProcessFunction;
    module?: IChironModule;
    exec: IBaseExecFunction;
}
export interface IBaseProcessFunction {
    (input: any, input2?: any): any;
}
export interface IBaseExecFunction extends IBaseProcessFunction {
    (input: any, InvokerId?: Snowflake): any;
}
export interface IBaseInteractionComponentOption extends IBaseComponentOptions {
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
    readonly description?: string;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction;
    readonly process: IInteractionProcessFunction;
    guildId?: Snowflake;
}
export interface IBaseInteractionComponent extends IBaseComponent {
    readonly name: string;
    readonly description: string;
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction;
    guildId?: Snowflake;
    process: IInteractionProcessFunction;
}
export interface IInteractionPermissionsFunction {
    (interaction: Interaction): boolean;
}
export interface IInteractionProcessFunction extends IEventProcessFunction {
    (interaction: Interaction): any;
}
export interface ISlashCommandComponentOptions extends IBaseInteractionComponentOption {
    readonly builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
}
export interface ISlashCommandComponent extends IBaseInteractionComponent {
    readonly builder: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
}
export interface ISlashCommandInteractionProcessFunction {
    (interaction: CommandInteraction): any;
}
export interface IContextMenuCommandComponentOptions extends IBaseInteractionComponentOption {
    readonly builder: ContextMenuCommandBuilder;
    readonly description: string;
}
export interface IContextMenuCommandComponent extends IBaseInteractionComponent {
    readonly builder: ContextMenuCommandBuilder;
    readonly description: string;
}
export interface IEventComponentOptions extends IBaseComponentOptions {
    readonly trigger: Events | string;
    process: IEventProcessFunction | IMessageCommandProcessFunction;
}
export interface IEventComponent extends IBaseComponent {
    readonly trigger: Events | string;
    process: IEventProcessFunction | IMessageCommandProcessFunction;
}
export interface IEventProcessFunction {
    (arg1?: any, arg2?: any, arg3?: any): any;
}
export interface IMessageComponentInteractionComponentOptions extends IEventComponentOptions {
    customId: string | customIdFunction;
    permissions: IInteractionPermissionsFunction;
    process: IInteractionProcessFunction;
}
export interface IMessageComponentInteractionComponent extends IEventComponent {
    customId: string | customIdFunction;
    permissions: IInteractionPermissionsFunction;
    process: IInteractionProcessFunction;
}
export interface customIdFunction {
    (interactionCustomId: string): boolean;
}
export interface IScheduleComponentOptions extends IBaseComponentOptions {
    readonly chronSchedule: string;
    readonly process: IScheduleProccessFunction;
}
export interface IScheduleComponent extends IBaseComponent {
    job?: Schedule.Job;
    process: IScheduleProccessFunction;
    readonly chronSchedule: string;
}
export interface IScheduleProccessFunction extends IBaseProcessFunction {
    (fireDate: Date): object | void;
}
export type IModuleOnLoadComponentOptions = IBaseComponentOptions;
export type IModuleOnUnloadComponentOptions = IBaseComponentOptions;
export type IModuleOnLoadComponent = IBaseComponent;
export type IModuleOnUnloadComponent = IBaseComponent;
export interface IMessageCommandComponentOptions extends IEventComponentOptions {
    trigger: string | Events;
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly permissions: IMessageCommandPermissionsFunction;
    process: IMessageCommandProcessFunction;
}
export interface IMessageCommandComponent extends IEventComponent {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly permissions: IMessageCommandPermissionsFunction;
    process: IMessageCommandProcessFunction;
}
export interface IMessageCommandProcessFunction extends IBaseProcessFunction {
    (msg: Message, suffix: string): any;
}
export interface IMessageCommandPermissionsFunction {
    (msg: Message): any;
}
