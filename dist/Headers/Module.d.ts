import { Client, CommandInteraction, ContextMenuCommandBuilder, Events, Interaction, Message, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, Snowflake } from "discord.js";
import * as Schedule from "node-schedule";
import { EventArgument1, EventArgument2, EventArgument3 } from "./EventHandler";
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
    readonly guildId?: Snowflake | Array<Snowflake>;
    readonly bypassSmite?: boolean;
    module?: IChironModule;
    feature?: string;
}
export interface IBaseComponent {
    readonly bypassSmite: boolean;
    readonly enabled: boolean;
    readonly process: IBaseProcessFunction;
    readonly guildId?: Snowflake | Array<Snowflake>;
    readonly feature?: string;
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
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
    readonly description?: string;
    readonly category: string;
    readonly guildId?: Snowflake | Array<Snowflake>;
    readonly permissions: IInteractionPermissionsFunction;
    readonly process: IInteractionProcessFunction;
}
export interface IBaseInteractionComponent extends IBaseComponent {
    readonly name: string;
    readonly description: string;
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction;
    readonly guildId?: Snowflake | Array<Snowflake>;
    process: IInteractionProcessFunction;
}
export interface IInteractionPermissionsFunction {
    (interaction: Interaction): boolean | Promise<boolean>;
}
export interface IInteractionProcessFunction extends IEventProcessFunction {
    (interaction: Interaction): any;
}
export interface ISlashCommandComponentOptions extends IBaseInteractionComponentOption {
    readonly builder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
}
export interface ISlashCommandComponent extends IBaseInteractionComponent {
    readonly builder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | Omit<SlashCommandBuilder, "addBooleanOption" | "addUserOption" | "addChannelOption" | "addRoleOption" | "addAttachmentOption" | "addMentionableOption" | "addStringOption" | "addIntegerOption" | "addNumberOption">;
    readonly process: ISlashCommandInteractionProcessFunction;
}
export interface ISlashCommandInteractionProcessFunction extends IInteractionProcessFunction {
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
    (args: [EventArgument1, EventArgument2, EventArgument3]): any;
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
