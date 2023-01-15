import { ContextMenuCommandBuilder } from "discord.js";
import { ChironModuleComponentBaseInteraction, ChironModuleComponentBaseInteractionOptions } from "./ChironModuleComponent.InteractionBase";

export interface ChironModuleComponentContextMenuCommandOptions extends ChironModuleComponentBaseInteractionOptions {
    builder: ContextMenuCommandBuilder //Contains our name and description
    description: string
}


export class ChironModuleComponentContextMenuCommand extends ChironModuleComponentBaseInteraction {


    constructor(ChironModuleComponentContextMenuCommandOptions: ChironModuleComponentContextMenuCommandOptions) {
        super(ChironModuleComponentContextMenuCommandOptions);
    }
}