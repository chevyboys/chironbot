
import {SlashCommandBuilder } from "discord.js";
import { ChironModuleComponentBaseInteraction, ChironModuleComponentBaseInteractionOptions } from "./ChironModuleComponent.InteractionBase";

export interface ChironModuleComponentSlashCommandOptions extends ChironModuleComponentBaseInteractionOptions {
    builder: SlashCommandBuilder //Contains our name and description
}


export class ChironModuleComponentSlashCommand extends ChironModuleComponentBaseInteraction {
    

    constructor( ChironModuleComponentSlashCommandOptions: ChironModuleComponentSlashCommandOptions) {
        super(ChironModuleComponentSlashCommandOptions);
    }
}