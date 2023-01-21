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
    add(Client: ChironClient, Component: IEventComponent) {
        if (Component.enabled) {
            if (!this.has(Component.trigger)) {
                this.set(Component.trigger, [])
                Client.on(Component.trigger, (arg1, arg2) => {
                    this.get(Component.trigger)?.forEach(([name, comp]) => {
                        comp.exec(arg1, arg2);
                    })
                })
            }
            if (Component.module) this.get(Component.trigger)?.push([(Component.module.name), Component]);
            else throw new Error("Cannot register event without it being attached to a module");

        }
    };
    remove(Component: IEventComponent) {
        if (!this.has(Component.trigger)) {
            return;
        }
        if (Component.module) {
            let EventArray = this.get(Component.trigger)
            if (EventArray) removeFromArray(EventArray, EventArray.find(([name, comp]) => name == Component.module?.name && comp == Component));
        }
        else throw new Error("Cannot remove event without it being attached to a module");
    }
}