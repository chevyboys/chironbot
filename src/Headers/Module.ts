
import { ApplicationCommand, Client, CommandInteraction, ContextMenuCommandBuilder, Events, Interaction, Message, SlashCommandBuilder, Snowflake } from "discord.js";
import * as Schedule from "node-schedule";

export interface IChironModuleOptions {
    readonly name?: string
    readonly file?: string
    components: Array<IBaseComponent>
    client?: Client
}

export interface IChironModule {
    readonly name: string
    file?: string
    components: Array<IBaseComponent>
    client?: Client
}

/* ------------------------------------------------------------------------------------------------------
 * ----------------- Component Interfaces ---------------------------------------------------------------
 */

//------------------- Base Component ------------------------------
// All components are derived from this

export interface IBaseComponentOptions {
    readonly enabled: boolean
    readonly process: IBaseProcessFunction
    module?: IChironModule
}

export interface IBaseComponent {
    readonly enabled: boolean;
    readonly process: IBaseProcessFunction;
    module?: IChironModule;
    exec: IBaseExecFunction; //added by the component manager
}

export interface IBaseProcessFunction {
    (input: any, input2?: any): any
}

export interface IBaseExecFunction extends IBaseProcessFunction {
    (input: any, InvokerId?: Snowflake): any
}

//--------------------------------------------------------------------------
//------------------- Base Interact Component ------------------------------
// The base for all other Interaction Components

export interface IBaseInteractionComponentOption extends IBaseComponentOptions {
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder    //Contains our name and description, and is the builder for our interaction
    readonly description?: string
    readonly category: string
    readonly permissions: IInteractionPermissionsFunction //A function that receives an interaction object, and returns if the interaction user can do it
    readonly process: IInteractionProcessFunction;
}

export interface IBaseInteractionComponent extends IBaseComponent {
    readonly name: string; //derived from the builder
    readonly description: string; //derived from the builder if not directly defined
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly category: string;
    readonly permissions: IInteractionPermissionsFunction // a function that receives an interaction and returns if the function is allowed to be executed
    process: IInteractionProcessFunction;
}

export interface IInteractionPermissionsFunction {
    (interaction: Interaction): boolean
}

export interface IInteractionProcessFunction {
    (interaction: Interaction): any
}

//--------------------------------------------------------------------------
//------------------- Slash Command Component ------------------------------
// Slash command Component
export interface ISlashCommandComponentOptions extends IBaseInteractionComponentOption {
    readonly builder: SlashCommandBuilder //Contains our name and description

}

export interface ISlashCommandComponent extends IBaseInteractionComponent {
    readonly builder: SlashCommandBuilder;
}

export interface ISlashCommandInteractionProcessFunction {
    (interaction: CommandInteraction): any
}

//--------------------------------------------------------------------------
//------------------- Context Menu Command Component ------------------------------
// The base for all other Interaction Components
export interface IContextMenuCommandComponentOptions extends IBaseInteractionComponentOption {
    readonly builder: ContextMenuCommandBuilder //Contains our name and description
    readonly description: string
}


export interface IContextMenuCommandComponent extends IBaseInteractionComponent {
    readonly builder: ContextMenuCommandBuilder //Contains our name and description
    readonly description: string
}

//--------------------------------------------------------------------------
//event handler
export interface IEventComponentOptions extends IBaseComponentOptions {
    readonly trigger?: any
    process: IEventProcessFunction | IMessageCommandProcessFunction | any
}

export interface IEventComponent extends IBaseComponent {
    readonly trigger: any
    process: IEventProcessFunction | IMessageCommandProcessFunction | any
}



export interface IEventProcessFunction {
    (arg1?: any, arg2?: any, arg3?: any): any
}


//--------------------------------------------------------------------------
// ------------------------- message component interaction -----------------

export interface IMessageComponentInteractionComponentOptions extends IEventComponentOptions {
    customId: string | customIdFunction;
    permissions: IInteractionPermissionsFunction;
    process: IInteractionProcessFunction
}

export interface IMessageComponentInteractionComponent extends IEventComponent {
    customId: string | customIdFunction;
    permissions: IInteractionPermissionsFunction;
    process: IInteractionProcessFunction;
}

export interface customIdFunction {
    (interactionCustomId: string): boolean;
}

//--------------------------------------------------------------------------
//------------------------ Schedule Components ----------------------------
export interface IScheduleComponentOptions extends IBaseComponentOptions {
    readonly chronSchedule: string //the number of seconds to wait between refresh intervals
    readonly process: IScheduleProccessFunction
}

export interface IScheduleComponent extends IBaseComponent {
    job?: Schedule.Job; //build by constructor
    process: IScheduleProccessFunction
    readonly chronSchedule: string //the number of seconds to wait between refresh intervals
}

export interface IScheduleProccessFunction extends IBaseProcessFunction {
    (client: Client, fireDate: Date): any
    //the client is the Chiron Client, and the Date is the date the event is supposed to fire.
}

//-------------------------------------------------------------------------
//---------------- Module Loading and unloading components ----------------
export interface IModuleLoadingOptions extends IBaseComponentOptions {

}

export interface IModuleUnloadingOptions extends IBaseComponentOptions {

}

export interface IModuleLoading extends IBaseComponent {

}

export interface IModuleUnloading extends IBaseComponent {

}

//-------------------------------------------------------------------------
// ------------------ Message Command Hanlder ---------------------------
export interface IMessageCommandComponentOptions extends IEventComponentOptions {
    trigger?: null;
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly permissions: IMessageCommandPermissionsFunction // a function that receives an message and returns if the function is allowed to be executed
    process: IMessageCommandProcessFunction | any;

}

export interface IMessageCommandComponent extends IEventComponent {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly permissions: IMessageCommandPermissionsFunction // a function that receives an message and returns if the function is allowed to be executed
    process: IMessageCommandProcessFunction | any;
}

export interface IMessageCommandProcessFunction extends IBaseProcessFunction {
    (msg: Message, suffix: string): any;
}
export interface IMessageCommandPermissionsFunction {
    (msg: Message): any;
}