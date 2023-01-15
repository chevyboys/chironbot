import { Interaction, Message, Snowflake } from "discord.js";
import { HexColorString, Client, ClientOptions } from "discord.js";
import { IModuleManager} from "./ModuleManager";
import { IChironConfig } from "./Config";


    export interface IChironClientOptions extends ClientOptions {
        config: IChironConfig
        color: HexColorString; //the color the bot should default to
        modulePath: string | Array<string>,
        DEBUG: boolean //weather or not to enable Debugging mode and instant guild command registration
        errorHandler: IErrorHandlerFunction
        smiteArray: Array<Snowflake> //an array of people to deny permissions to in all cases
    }


    export interface IChironClient extends Client {
        config: IChironConfig;
        color: HexColorString;
        modulePath: string | Array<string>;
        DEBUG: boolean //weather or not to enable Debugging mode and instant guild command registration
        errorHandler: IErrorHandlerFunction
        smiteArray: Array<Snowflake> //an array of people to deny permissions to in all cases
        modules: IModuleManager
    }

    export interface IErrorHandlerFunction {
        (error: any, msg: Message | Interaction | string) : any
    }
