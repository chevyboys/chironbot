import { Component, Events, GatewayIntentBits, IntentsBitField, Interaction, Snowflake } from "discord.js";
import { HexColorString, Client } from "discord.js";
import { ChironParseFunction, IChironClient, IChironClientBuilder, IChironClientOptions, IErrorHandlerFunction } from "../Headers/Client";
import { IChironConfig } from "../Headers/Config";
import { IModuleManager, IModuleManagerRegisterable } from "../Headers/ModuleManager";
import { ModuleManager } from "./ModuleManager";
import { DefaultErrorHandler, DefaultParseMessage } from "../Objects/ClientDefaults";
import { IChironModule } from "../Headers/Module";
import { registerInteractions, resolveRegisterable } from "../Objects/Utilities";
import { BaseInteractionComponent, ModuleLoading, EventComponent, MessageCommandComponent, MessageComponentInteractionComponent, ScheduleComponent, SlashCommandComponent, ContextMenuCommandComponent } from "./Module";
import { IntentEventMap } from "../Objects/IntentsMap";

function getIntentFromEvent(event: Events) {
    let intents = IntentEventMap.filter(element => {
        element.events.includes(event);
    }).map(element => element.intent);
    return intents;
}

export class ChironClient extends Client implements IChironClient {
    config: IChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    errorHandler?: IErrorHandlerFunction
    modules: IModuleManager;
    parser: ChironParseFunction;



    constructor(ChironClientOptions: IChironClientOptions) {
        super(ChironClientOptions);
        this.config = ChironClientOptions.config;
        this.color = ChironClientOptions.color;
        this.modulePath = ChironClientOptions.modulePath;
        this.errorHandler = ChironClientOptions.errorHandler || DefaultErrorHandler;
        this.parser = ChironClientOptions.parser || DefaultParseMessage
        this.modules = new ModuleManager(this);

    }
}

export class ChironClientBuilder implements IChironClientBuilder {
    static build = async (options: IChironClientOptions) => {
        let intents = new IntentsBitField(options.intents)
        if (options.modulePath) intents.add(await smartIntents(options.modulePath))
        let improvedOptions = options;
        improvedOptions.intents = intents
        let client = new ChironClient(improvedOptions)
        await client.login(options.config.token);
        await client.modules.register();
        return client;
    }
}

async function smartIntents(registerable: IModuleManagerRegisterable,): Promise<IntentsBitField> {
    let modules: Array<IChironModule> = await resolveRegisterable(registerable);
    let intents = new IntentsBitField();

    //take care of onInit functions, and register commands to discord


    for (const module of modules) {
        for (const component of module.components) {
            if (component.enabled) {
                if (component instanceof EventComponent) {
                    if (component instanceof MessageCommandComponent) {
                        let componentIntents = getIntentFromEvent(Events.MessageCreate);
                        if (componentIntents) intents.add(componentIntents as unknown as GatewayIntentBits);
                    } else if (!(component instanceof MessageComponentInteractionComponent)) {
                        let componentIntents = getIntentFromEvent(component.trigger);
                        if (componentIntents) intents.add(componentIntents as unknown as GatewayIntentBits);
                    }
                }
            }

        }
    }


    return intents;
}