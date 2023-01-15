import { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommand, Interaction, Events } from "discord.js";
import { IBaseComponent, IBaseExecFunction, IBaseInteractionComponent, IBaseProcessFunction, IChironModule, IChironModuleOptions, IClockworkComponent, IContextMenuCommandComponent, IEventComponent, IInteractionPermissionsFunction, IModuleLoading, ISlashCommandComponent } from "../../Headers/Module";
import { ChironClient } from "../ChironClient";
import path from "path"
let fileName = path.basename(__filename);


export class ChironModule implements IChironModule {
    name: string;
    components: Array<IBaseComponent>;
    client: ChironClient;
    file?:string

    constructor(ModuleOptions:IChironModuleOptions){
        if (ModuleOptions.client instanceof ChironClient) {
            this.client = ModuleOptions.client;
        }
        this.name = ModuleOptions.name || fileName;
        this.components = ModuleOptions.components
    }
}

/* ------------------------------------------------------------------------------------------------------
 * ----------------- Component Classes ---------------------------------------------------------------
 */

//------------------- Base Component ------------------------------
// All components are derived from this
export class BaseComponent implements IBaseComponent {
    readonly enabled: boolean;
    readonly process: IBaseProcessFunction;
    module: IChironModule;
    exec: IBaseExecFunction; //added by the component manager
}


//--------------------------------------------------------------------------
//------------------- Base Interact Component ------------------------------
// The base for all other Interaction Components

export class BaseInteractionComponent extends BaseComponent implements IBaseInteractionComponent {
    readonly name: string; //derived from the builder
    readonly description: string; //derived from the builder if not directly defined
    readonly builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    readonly category: string;
    command: ApplicationCommand; //the discord registered command instance of this command, added by the Module Registrar
    readonly permissions: IInteractionPermissionsFunction // a function that receives an interaction and returns if the function is allowed to be executed
}

//--------------------------------------------------------------------------
//------------------- Slash Command Component ------------------------------
// Slash command Component
export class SlashCommandComponent extends BaseInteractionComponent implements ISlashCommandComponent {
    readonly builder: SlashCommandBuilder;
}

//--------------------------------------------------------------------------
//------------------- Context Menu Command Component ------------------------------
// The base for all other Interaction Components



export class ContextMenuCommandComponent extends BaseInteractionComponent implements IContextMenuCommandComponent {
    readonly builder: ContextMenuCommandBuilder //Contains our name and description
    readonly description: string
}

//--------------------------------------------------------------------------
//event handler

export class EventComponent extends BaseComponent implements IEventComponent{
    readonly trigger: Events
}


//--------------------------------------------------------------------------
//------------------------ Clockwork Components ----------------------------


export class ClockworkComponent extends BaseComponent implements IClockworkComponent {
    readonly interval: number //the number of seconds to wait between refresh intervals
}

//-------------------------------------------------------------------------
//---------------- Module Loading and unloading components ----------------

export class ModuleLoading extends BaseComponent implements IModuleLoading{

}

export class ModuleUnloading extends BaseComponent {

}