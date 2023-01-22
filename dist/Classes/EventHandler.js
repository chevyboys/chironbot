import { Collection } from "discord.js";
function removeFromArray(Array, item) {
    let index = Array.indexOf(item);
    if (index !== -1) {
        Array.splice(index, 1);
    }
}
;
//this will handle everything except interactionCreate Events, since those have their own special way of being found
export class EventHandlerCollection extends Collection {
    constructor(options) {
        super(options);
    }
    add(Client, Component, EventOverride) {
        if (Component.enabled) {
            let trigger = EventOverride || Component.trigger;
            if (!this.has(trigger)) {
                this.set(trigger, []);
                Client.on(trigger, (arg1, arg2) => {
                    this.get(trigger)?.forEach(([name, comp]) => {
                        comp.exec(arg1, arg2);
                    });
                });
            }
            if (Component.module)
                this.get(trigger)?.push([(Component.module.name), Component]);
            else
                throw new Error("Cannot register event without it being attached to a module");
        }
    }
    ;
    remove(Component, EventOverride) {
        let trigger = EventOverride || Component.trigger;
        if (!this.has(trigger)) {
            return;
        }
        if (Component.module) {
            let EventArray = this.get(trigger);
            if (EventArray)
                removeFromArray(EventArray, EventArray.find(([name, comp]) => name == Component.module?.name && comp == Component));
        }
        else
            throw new Error("Cannot remove event without it being attached to a module");
    }
}
//# sourceMappingURL=EventHandler.js.map