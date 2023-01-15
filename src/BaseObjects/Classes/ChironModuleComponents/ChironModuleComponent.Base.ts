import { ChironClient } from "../ChironClient";

export interface ChironModuleComponentBaseOptions {
    enabled: boolean
    process: Function
}


export class ChironModuleComponentBase {
    enabled: boolean;
    process: Function;
    constructor(ChironModuleComponentBaseOptions: ChironModuleComponentBaseOptions) {
        this.enabled = ChironModuleComponentBaseOptions.enabled || true;
        this.process = ChironModuleComponentBaseOptions.process;
    }
}