
import { ApplicationCommand, Client, ContextMenuCommandBuilder, Events, Interaction, SlashCommandBuilder } from "discord.js";


export interface IChironModuleOptions {
    readonly name: string
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
    module: IChironModule;
    exec: IBaseExecFunction; //added by the component manager
}

export interface IBaseProcessFunction {
    (input: any): string
}

export interface IBaseExecFunction extends IBaseProcessFunction {

}

//--------------------------------------------------------------------------
//------------------- Base Interact Component ------------------------------
// The base for all other Interaction Components

export interface IBaseInteractionComponentOption extends IBaseComponentOptions {
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder    //Contains our name and description, and is the builder for our interaction
    readonly description?: string
    readonly category: string
    readonly permissions: IInteractionPermissionsFunction //A function that receives an interaction object, and returns if the interaction user can do it
}

export interface IBaseInteractionComponent extends IBaseComponent {
    readonly name: string; //derived from the builder
    readonly description: string; //derived from the builder if not directly defined
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly category: string;
    command: ApplicationCommand; //the discord registered command instance of this command, added by the Module Registrar
    readonly permissions: IInteractionPermissionsFunction // a function that receives an interaction and returns if the function is allowed to be executed
}

export interface IInteractionPermissionsFunction {
    (interaction: Interaction): boolean
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
    readonly trigger: Events
}

export interface IEventComponent extends IBaseComponent {
    readonly trigger: Events
}


//--------------------------------------------------------------------------
//------------------------ Clockwork Components ----------------------------
export interface IClockworkComponentOptions extends IBaseComponentOptions {
    readonly interval: number //the number of seconds to wait between refresh intervals
}

export interface IClockworkComponent extends IBaseComponent {
    readonly interval: number //the number of seconds to wait between refresh intervals
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