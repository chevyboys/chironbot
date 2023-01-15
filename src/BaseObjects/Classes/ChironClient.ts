import { HexColorString, Client, ClientOptions } from "discord.js"
import { ChironConfig } from "./ChironConfig"

export interface ChironClientOptions extends ClientOptions {
    config: ChironConfig
    color: HexColorString; //the color the bot should default to
    modulePath: string | Array<string>,
    DEBUG: boolean //weather or not to enable Debugging mode and instant guild command registration
    
}


export class ChironClient extends Client {
    config: ChironConfig;
    color: HexColorString;
    modulePath: string | Array<string>;
    DEBUG: boolean //weather or not to enable Debugging mode and instant guild command registration

    constructor(ChironClientOptions: ChironClientOptions){
        super(ChironClientOptions);
        this.config = ChironClientOptions.config;
        this.color = ChironClientOptions.color;
        this.modulePath = ChironClientOptions.modulePath;
        this.DEBUG = ChironClientOptions.DEBUG || false;
    }

}

