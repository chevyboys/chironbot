import { Events, IntentsBitField } from "discord.js";
import { Client } from "discord.js";
import { ModuleManager } from "./ModuleManager";
import { DefaultErrorHandler, DefaultParseMessage } from "../Objects/ClientDefaults";
import { resolveRegisterable } from "../Objects/Utilities";
import { EventComponent, MessageCommandComponent, MessageComponentInteractionComponent } from "./Module";
import { IntentEventMap } from "../Objects/IntentsMap";
function getIntentFromEvent(event) {
    let intents = IntentEventMap.filter(element => {
        element.events.includes(event);
    }).map(element => element.intent);
    return intents;
}
export class ChironClient extends Client {
    config;
    color;
    modulePath;
    errorHandler;
    modules;
    parser;
    constructor(ChironClientOptions) {
        super(ChironClientOptions);
        this.config = ChironClientOptions.config;
        this.color = ChironClientOptions.color;
        this.modulePath = ChironClientOptions.modulePath;
        this.errorHandler = ChironClientOptions.errorHandler || DefaultErrorHandler;
        this.parser = ChironClientOptions.parser || DefaultParseMessage;
        this.modules = new ModuleManager(this);
    }
}
export class ChironClientBuilder {
    static build = async (options) => {
        let intents = new IntentsBitField(options.intents);
        if (options.modulePath)
            intents.add(await smartIntents(options.modulePath));
        let improvedOptions = options;
        improvedOptions.intents = intents;
        let client = new ChironClient(improvedOptions);
        await client.login(options.config.token);
        await client.modules.register();
        return client;
    };
}
async function smartIntents(registerable) {
    let modules = await resolveRegisterable(registerable);
    let intents = new IntentsBitField();
    //take care of onInit functions, and register commands to discord
    for (const module of modules) {
        for (const component of module.components) {
            if (component.enabled) {
                if (component instanceof EventComponent) {
                    if (component instanceof MessageCommandComponent) {
                        let componentIntents = getIntentFromEvent(Events.MessageCreate);
                        if (componentIntents)
                            intents.add(componentIntents);
                    }
                    else if (!(component instanceof MessageComponentInteractionComponent)) {
                        let componentIntents = getIntentFromEvent(component.trigger);
                        if (componentIntents)
                            intents.add(componentIntents);
                    }
                }
            }
        }
    }
    return intents;
}
//# sourceMappingURL=ChironClient.js.map