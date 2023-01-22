import { Collection, Events } from "discord.js";
import { IEventHandlerCollection } from "../Headers/EventHandler";
import { IEventComponent } from "../Headers/Module";
import { ChironClient } from "./ChironClient";
export declare class EventHandlerCollection extends Collection<Events, Array<[string, IEventComponent]>> implements IEventHandlerCollection {
    constructor(options?: null | Array<[Events, Array<[string, IEventComponent]>]>);
    add(Client: ChironClient, Component: IEventComponent, EventOverride?: Events): void;
    remove(Component: IEventComponent, EventOverride?: Events): void;
}
