import { Collection, Events } from "discord.js";
import { IEventHandlerCollection } from "../Headers/EventHandler";
import { IEventComponent } from "../Headers/Module";
import { ChironClient } from "./ChironClient";

function removeFromArray(Array: Array<any>, item: any) {
    let index = Array.indexOf(item);
    if (index !== -1) {
        Array.splice(index, 1);
    }
};
//this will handle everything except interactionCreate Events, since those have their own special way of being found
export class EventHandlerCollection extends Collection<Events, Array<[string, IEventComponent]>> implements IEventHandlerCollection {
    constructor(options?: null | Array<[Events, Array<[string, IEventComponent]>]>) {
        super(options)
    }
    add(Client: ChironClient, Component: IEventComponent, EventOverride?: Events) {
        if (Component.enabled) {
            let trigger = EventOverride || Component.trigger
            if (!this.has(trigger)) {
                this.set(trigger, [])
                Client.on(trigger as unknown as any, (arg1, arg2) => {
                    this.get(trigger)?.forEach(([name, comp]) => {
                        comp.exec(arg1, arg2);
                    })
                })
            }
            if (Component.module) this.get(trigger)?.push([(Component.module.name), Component]);
            else throw new Error("Cannot register event without it being attached to a module");

        }
    };
    remove(Component: IEventComponent, EventOverride?: Events) {
        let trigger = EventOverride || Component.trigger
        if (!this.has(trigger)) {
            return;
        }
        if (Component.module) {
            let EventArray = this.get(trigger)
            if (EventArray) removeFromArray(EventArray, EventArray.find(([name, comp]) => name == Component.module?.name && comp == Component));
        }
        else throw new Error("Cannot remove event without it being attached to a module");
    }
}