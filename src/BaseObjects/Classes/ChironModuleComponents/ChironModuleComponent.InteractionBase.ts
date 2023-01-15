
import { ContextMenuCommandBuilder, SelectMenuBuilder, SharedNameAndDescription } from "@discordjs/builders";
import { ApplicationCommand, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ChironModuleComponentBase, ChironModuleComponentBaseOptions } from "./ChironModuleComponent.Base";

export interface ChironModuleComponentBaseInteractionOptions extends ChironModuleComponentBaseOptions {
    builder: SlashCommandBuilder | ContextMenuCommandBuilder    //Contains our name and description, and is the builder for our interaction
    description?: string
    category: string
    permissions: Function //A function that receives an interaction object, and returns if the interaction user can do it
}


export class ChironModuleComponentBaseInteraction extends ChironModuleComponentBase {
    name: string;
    description: string;
    builder: SlashCommandBuilder | ContextMenuCommandBuilder;
    category: string;
    command: ApplicationCommand; //the discord registered command instance of this command
    permissions: Function = (interaction: CommandInteraction) => true;
    constructor(ChironModuleComponentBaseInteractionOptions: ChironModuleComponentBaseInteractionOptions) {
        super(ChironModuleComponentBaseInteractionOptions)
        this.name = ChironModuleComponentBaseInteractionOptions.builder.name;
        this.description = ChironModuleComponentBaseInteractionOptions.builder instanceof SlashCommandBuilder ?
            ChironModuleComponentBaseInteractionOptions.builder.description :
            ChironModuleComponentBaseInteractionOptions.description || "";
        this.category = ChironModuleComponentBaseInteractionOptions.category;
        this.permissions = ChironModuleComponentBaseInteractionOptions.permissions;
        this.builder = ChironModuleComponentBaseInteractionOptions.builder
    }
}