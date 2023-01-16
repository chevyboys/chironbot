import { Client, CommandInteraction, ContextMenuCommandBuilder, Interaction, Message, SlashCommandBuilder, Snowflake } from "discord.js";
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
    (input: any): string;
}
export interface IBaseExecFunction extends IBaseProcessFunction {
    (input: any, InvokerId: Snowflake): string;
}
export interface IBaseInteractionComponentOption extends IBaseComponentOptions {
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly description?: string;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction;
    readonly process: IInteractionProcessFunction;
}
export interface IBaseInteractionComponent extends IBaseComponent {
    readonly name: string;
    readonly description: string;
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction;
    process: IInteractionProcessFunction;
}
export interface IInteractionPermissionsFunction {
    (interaction: Interaction): boolean;
}
export interface IInteractionProcessFunction {
    (interaction: Interaction): any;
}
export interface ISlashCommandComponentOptions extends IBaseInteractionComponentOption {
    readonly builder: SlashCommandBuilder;
}
export interface ISlashCommandComponent extends IBaseInteractionComponent {
    readonly builder: SlashCommandBuilder;
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
    readonly trigger: any;
    process: IEventProcessFunction;
}
export interface IEventComponent extends IBaseComponent {
    readonly trigger: any;
    process: IEventProcessFunction;
}
export interface IEventProcessFunction {
    (args: any): any;
}
export interface IMessageComponentInteractionComponentOptions extends IEventComponentOptions {
    customId: string | customIdFunction;
    process: IInteractionProcessFunction;
}
export interface IMessageComponentInteractionComponent extends IEventComponent {
    customId: string | customIdFunction;
    process: IInteractionProcessFunction;
}
export interface customIdFunction {
    (interactionCustomId: string): boolean;
}
export interface IClockworkComponentOptions extends IBaseComponentOptions {
    readonly interval: number;
}
export interface IClockworkComponent extends IBaseComponent {
    readonly interval: number;
}
export interface IModuleLoadingOptions extends IBaseComponentOptions {
}
export interface IModuleUnloadingOptions extends IBaseComponentOptions {
}
export interface IModuleLoading extends IBaseComponent {
}
export interface IModuleUnloading extends IBaseComponent {
}
export interface IMessageCommandComponentOptions extends IEventComponentOptions {
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
export interface IMessageCommandProcessFunction extends IEventProcessFunction {
    (msg: Message, suffix: string): any;
}
export interface IMessageCommandPermissionsFunction {
    (msg: Message): any;
}
