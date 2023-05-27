import { ApplicationCommandPermissionsUpdateData, AutoModerationActionExecution, AutoModerationRule, BaseInteraction, Client, Collection, DMChannel, Events, ForumChannel, Guild, GuildAuditLogsEntry, GuildBan, GuildChannel, GuildEmoji, GuildMember, GuildScheduledEvent, GuildTextBasedChannel, Invite, Message, MessageReaction, NewsChannel, Presence, Role, Snowflake, StageChannel, StageInstance, Sticker, TextChannel, ThreadChannel, ThreadMember, Typing, User, VoiceChannel, VoiceState } from "discord.js";
import { IChironClient } from "./Client";
import { IEventComponent } from "./Module"


export interface IEventHandlerCollection extends Collection<Events, Array<[string, IEventComponent]>> {
    add: IEventAddFunc
    remove: IEventRemoveFunc
}

export interface IEventAddFunc {
    (Client: IChironClient, Component: IEventComponent, EventOverride?: Events): object | void
}

export interface IEventRemoveFunc {
    (Component: IEventComponent, EventOverride?: Events): object | void
}


type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type EventArgument1 = PropType<EventArguments, "arg1">
export type EventArgument2 = PropType<EventArguments, "arg2">
export type EventArgument3 = PropType<EventArguments, "arg3">

type EventArguments = {
    event: Events.ApplicationCommandPermissionsUpdate,
    /**
     * the updated permissions
     */
    arg1: ApplicationCommandPermissionsUpdateData,
    arg2: null,
    arg3: null | undefined
} | {
    event: Events.AutoModerationActionExecution,
    /**
     * the data of the execution
     */
    arg1: AutoModerationActionExecution,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.AutoModerationRuleCreate,
    /**
     * the rule that was created
     */
    arg1: AutoModerationRule,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.AutoModerationRuleDelete,
    /**
     * the rule that was deleted
     */
    arg1: AutoModerationRule,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.AutoModerationRuleUpdate,
    /**
     * the old version of the rule that was updated
     */
    arg1: AutoModerationRule,
    /**
     * the new version of the rule that was updated
     */
    arg2: AutoModerationRule,
    arg3: null | undefined
} | {
    event: Events.ChannelCreate,
    /**
     * the channel that was created
     */
    arg1: GuildChannel,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.ChannelDelete,
    /**
     * the channel that was deleted
     */
    arg1: GuildChannel | DMChannel,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.ChannelPinsUpdate,
    /**
     * the channel that the pins were updated in
     */
    arg1: GuildTextBasedChannel | DMChannel,
    /**
     * the time at which the pins were last updated
     */
    arg2: Date,
    arg3: null | undefined
} | {
    event: Events.ChannelUpdate,
    /**
     * the old version of the channel that was updated
     */
    arg1: GuildChannel | DMChannel,
    /**
     * the new version of the channel that was updated
     */
    arg2: GuildChannel | DMChannel,
    arg3: null | undefined
} | {
    event: Events.Debug,
    /**
     * the debug info
     */
    arg1: string,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildEmojiCreate,
    /**
     * the emoji that was created
    */
    arg1: GuildEmoji,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildEmojiDelete,
    /** 
     * the emoji that was deleted
    */
    arg1: GuildEmoji,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildEmojiUpdate,
    /**
     * the old version of the emoji that was updated
     */
    arg1: GuildEmoji,
    /** 
     * the new version of the emoji that was updated
    */
    arg2: GuildEmoji,
    arg3: null | undefined
} | {
    event: Events.Error,
    /**
     * the error that was thrown
     * Errors thrown within this event do not have a catch handler, it is recommended to not use async functions as error event handlers. See the Node.js docs  for details
     * https://nodejs.org/api/events.html#capture-rejections-of-promises
     */
    arg1: Error,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildAuditLogEntryCreate,
    /** 
     * the entry that was created
     */
    arg1: GuildAuditLogsEntry,
    /*
    * the guild that the entry was created in
    */
    arg2: Guild,
    arg3: null | undefined
} | {
    event: Events.GuildBanAdd,
    /**
     * The ban that occurred
     */
    arg1: GuildBan,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.GuildBanRemove,
    /**
     * The ban that was removed
     */
    arg1: GuildBan,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildCreate,
    /**
     * the guild that was created
    */
    arg1: Guild,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildDelete,
    /**
     * the guild that was deleted
     */
    arg1: Guild,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildIntegrationsUpdate,
    /**
     * the guild that the integrations were updated in
    */
    arg1: Guild,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildMemberAdd,
    /**
     * the member that joined a guild
     */
    arg1: GuildMember,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildMemberAvailable,
    /**
     * the member that became available
     */
    arg1: GuildMember,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildMemberRemove,
    /**
     * the member that left a guild
     */
    arg1: GuildMember,
    arg2: null | undefined,
    arg3: null | undefined

} | {
    event: Events.GuildMembersChunk,
    /**
     * the members in the chunk
     */
    arg1: Collection<Snowflake, GuildMember>,
    /**
     * the guild that the members were fetched in
     */
    arg2: Guild,
    /**
     * the properties for the received chunk
     */
    arg3: object
} | {
    event: Events.GuildMemberUpdate,
    /**
     *  the old version of the member that was updated
    */
    arg1: GuildMember,
    /**
     * the new version of the member that was updated
     */
    arg2: GuildMember,
    arg3: null | undefined
} | {
    event: Events.GuildScheduledEventCreate,
    /**
     * the event that was created
     */
    arg1: GuildScheduledEvent,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildScheduledEventDelete,
    /**
     * the event that was deleted
     */
    arg1: GuildScheduledEvent,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildScheduledEventUpdate,
    /**
     * the old version of the event that was updated
     * */
    arg1: GuildScheduledEvent,
    /**
     * the new version of the event that was updated
     * */
    arg2: GuildScheduledEvent,
    arg3: null | undefined
} | {
    event: Events.GuildScheduledEventUserAdd,
    /**
     * the event that the user was added to
     * */
    arg1: GuildScheduledEvent,
    /**
     * the user that was added to the event
     * */
    arg2: User,
    arg3: null | undefined
} | {
    event: Events.GuildScheduledEventUserRemove,
    /**
     *  the event that the user was removed from
     * */
    arg1: GuildScheduledEvent,
    /**
     * the user that was removed from the event
     * */
    arg2: User,
    arg3: null | undefined
} | {
    event: Events.GuildUnavailable,
    /**
     *  the guild that is unavailable
     * */
    arg1: Guild,
    arg2: null | undefined,
    arg3: null | undefined
} | {
    event: Events.GuildUpdate,
    /**
     * the old version of the guild that was updated
     * */
    arg1: Guild,
    /**
     * the new version of the guild that was updated
     * */
    arg2: Guild,
    arg3: null | undefined
} | {
    event: Events.InteractionCreate,
    /**
     * the interaction that was created
     * */
    arg1: BaseInteraction,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.InviteCreate,
    /**
     * the invite that was created
     * */
    arg1: Invite,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.InviteDelete,
    /**
     * the invite that was deleted
     * */
    arg1: Invite,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.MessageCreate,
    /**
     * the message that was created
     * */
    arg1: Message,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.MessageDelete,
    /**
     * the message that was deleted
     * */
    arg1: Message,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.MessageBulkDelete,
    /**
     * the messages that were deleted
     * */
    arg1: Collection<Snowflake, Message>,
    /**
     * the channel that the messages were deleted in
     */
    arg2: GuildTextBasedChannel,
    arg3: null | undefined,
} | {
    event: Events.MessageReactionAdd,
    /**
     * the reaction that was added
     * */
    arg1: MessageReaction,
    /**
     * the user that added the reaction
     */
    arg2: User,
    arg3: null | undefined,
} | {
    event: Events.MessageReactionRemove,
    /**
     * the reaction that was removed
     * */
    arg1: MessageReaction,
    /**
     * the user that removed the reaction
     * */
    arg2: User,
    arg3: null | undefined,
} | {
    event: Events.MessageReactionRemoveAll,
    /**
     * the message that all reactions were removed from
     * */
    arg1: Message,
    /**
     * The cached message reactions that were removed.
     */
    arg2: Collection<Snowflake | string, MessageReaction>,
    arg3: null | undefined,
} | {
    event: Events.MessageReactionRemoveEmoji,
    /**
     * the reaction that was removed
     * */
    arg1: MessageReaction,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.MessageUpdate,
    /**
     * the old version of the message that was updated
     * */
    arg1: Message,
    /**
     * the new version of the message that was updated
     * */
    arg2: Message,
    arg3: null | undefined,
} | {
    event: Events.PresenceUpdate,
    /**
     * the old version of the presence before the update
     * */
    arg1: Presence | null,
    /**
     * the new version of the presence after the update
     * */
    arg2: Presence,
    arg3: null | undefined,
} | {
    //ready
    event: Events.ClientReady,
    /**
     * the client that is ready
     * */
    arg1: Client,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.GuildRoleCreate,
    /**
     * the role that was created
     * */
    arg1: Role,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.GuildRoleDelete,
    /**
     * the role that was deleted
     * */
    arg1: Role,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    event: Events.GuildRoleUpdate,
    /**
     * the old version of the role that was updated
     * */
    arg1: Role,
    /**
     * the new version of the role that was updated
     * */
    arg2: Role,
    arg3: null | undefined,
} | {
    //shard disconnect
    event: Events.ShardDisconnect,
    /**
     * the websocket close event
     * */
    arg1: CloseEvent,
    /**
     * the shard id that disconnected
     * */
    arg2: number,
    arg3: null | undefined,
} | {
    //shard error
    event: Events.ShardError,
    /**
     * the error that was thrown
     * */
    arg1: Error,
    /**
     * the shard id that the error was thrown on
     * */
    arg2: number,
    arg3: null | undefined,
} | {
    //shard ready
    event: Events.ShardReady,
    /**
     * the id of the shard that is ready
     * */
    arg1: number,
    /**
     * the set of guilds that are unavailable, if any
     */
    arg2: Set<Snowflake> | undefined,
    arg3: null | undefined,
} | {
    //shard reconnecting
    event: Events.ShardReconnecting,
    /**
     * the id of the shard that is reconnecting
     * */
    arg1: number,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    //shard resume
    event: Events.ShardResume,
    /**
     * the id of the shard that resumed
     * */
    arg1: number,
    /**
     * the amount of replayed events
     * */
    arg2: number,
    arg3: null | undefined,
} | {
    //stage instance create
    event: Events.StageInstanceCreate,
    /**
     * the stage instance that was created
     * */
    arg1: StageInstance,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    //stage instance delete
    event: Events.StageInstanceDelete,
    /**
     * the stage instance that was deleted
     * */
    arg1: StageInstance,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    //stage instance update
    event: Events.StageInstanceUpdate,
    /**
     * the old stage instance
     * */
    arg1: StageInstance,
    /**
     * the new stage instance
     * */
    arg2: StageInstance,
    arg3: null | undefined,
} | {
    //sticker create
    event: Events.GuildStickerCreate,
    /**
     * the sticker that was created
     * */
    arg1: Sticker,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    //sticker delete
    event: Events.GuildStickerDelete,
    /**
     * the sticker that was deleted
     * */
    arg1: Sticker,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    //sticker update
    event: Events.GuildStickerUpdate,
    /**
     * the old sticker
     * */
    arg1: Sticker,
    /**
     * the new sticker
     * */
    arg2: Sticker,
    arg3: null | undefined,
} | {
    //thread create
    event: Events.ThreadCreate,
    /**
     * the thread that was created
     * */
    arg1: ThreadChannel,
    /**
     * wheather the thread is newly created
     */
    arg2: boolean,
    arg3: null | undefined,
} | {
    //thread delete
    event: Events.ThreadDelete,
    /**
     * the thread that was deleted
     * */
    arg1: ThreadChannel,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    //thread list sync
    event: Events.ThreadListSync,
    /**
     * The threads that were synced
     * */
    arg1: Collection<Snowflake, ThreadChannel>,
    /** 
     * the guild that the threads were synced in
     */
    arg2: Guild,
    arg3: null | undefined,
} | {
    //thread members update
    event: Events.ThreadMembersUpdate,
    /**
     * The members that were added
     * */
    arg1: Collection<Snowflake, ThreadMember>,
    /**
     * The members that were removed
     * */
    arg2: Collection<Snowflake, ThreadMember>,
    /**
     * the thread that the members were updated in
     * */
    arg3: ThreadChannel,
} | {
    //thread member update
    event: Events.ThreadMemberUpdate,
    /**
     * the old thread member
     * */
    arg1: ThreadMember,
    /**
     * the new thread member
     *  */
    arg2: ThreadMember,
    arg3: null | undefined,
} | {
    //thread update
    event: Events.ThreadUpdate,
    /**
     * the old thread
     * */
    arg1: ThreadChannel,
    /**
     * the new thread
     * */
    arg2: ThreadChannel,
    arg3: null | undefined,
} | {
    //typing start
    event: Events.TypingStart,
    /**
     * the typing state
     * */
    arg1: Typing,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    //user update
    event: Events.UserUpdate,
    /**
     * the old user
     * */
    arg1: User,
    /**
     * the new user
     * */
    arg2: User,
    arg3: null | undefined,
} | {
    //voice state update
    event: Events.VoiceStateUpdate,
    /**
     * the old voice state
     * */
    arg1: VoiceState,
    /**
     * the new voice state
     * */
    arg2: VoiceState,
    arg3: null | undefined,
} | {
    //warn
    event: Events.Warn,
    /**
     * the warning
     * */
    arg1: string,
    arg2: null | undefined,
    arg3: null | undefined,
} | {
    //webhook update
    event: Events.WebhooksUpdate,
    /**
     * the channel that the webhook was updated in
     * */
    arg1: TextChannel | NewsChannel | VoiceChannel | StageChannel | ForumChannel,
    arg2: null | undefined,
    arg3: null | undefined,
}