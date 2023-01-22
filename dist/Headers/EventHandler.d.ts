import { Collection, Events } from "discord.js";
import { IChironClient } from "./Client";
import { IEventComponent } from "./Module";
export interface IEventHandlerCollection extends Collection<Events, Array<[string, IEventComponent]>> {
    add: IEventAddFunc;
    remove: IEventRemoveFunc;
}
export interface IEventAddFunc {
    (Client: IChironClient, Component: IEventComponent, EventOverride?: Events): any;
}
export interface IEventRemoveFunc {
    (Component: IEventComponent, EventOverride?: Events): any;
}
