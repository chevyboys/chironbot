import { Events, IntentsBitField } from 'discord.js'


export const IntentEventMap = [
    {
        intent: IntentsBitField.Flags.Guilds,
        events: [
            Events.GuildCreate,
            Events.GuildUpdate,
            Events.GuildDelete,
            Events.GuildRoleCreate,
            Events.GuildRoleUpdate,
            Events.GuildRoleDelete,
            Events.ChannelCreate,
            Events.ChannelUpdate,
            Events.ChannelDelete,
            Events.ChannelPinsUpdate,
            Events.ThreadCreate,
            Events.ThreadUpdate,
            Events.ThreadDelete,
            Events.ThreadListSync,
            Events.ThreadMemberUpdate,
            Events.ThreadMembersUpdate,
            Events.StageInstanceCreate,
            Events.StageInstanceUpdate,
            Events.StageInstanceDelete,
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildMembers,
        events: [
            Events.GuildMemberAdd,
            Events.GuildMemberUpdate,
            Events.GuildMemberRemove,
            Events.ThreadMembersUpdate
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildBans,
        events: [
            Events.GuildBanAdd,
            Events.GuildBanRemove
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildEmojisAndStickers,
        events: [
            Events.GuildEmojiUpdate,
            Events.GuildStickerCreate
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildIntegrations,
        events: [
            Events.GuildIntegrationsUpdate,
            //Looks like Discord.js doesn't support these yet
            //            Events.GuildIntegrationCreate,
            //            Events.IntegrationUpdate,
            //            Events.IntegrationDelete
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildWebhooks,
        events: [
            Events.WebhooksUpdate
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildInvites,
        events: [
            Events.InviteCreate,
            Events.InviteDelete
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildVoiceStates,
        events: [
            Events.VoiceStateUpdate
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildPresences,
        events: [
            Events.PresenceUpdate
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildMessages,
        events: [
            Events.MessageCreate,
            Events.MessageUpdate,
            Events.MessageDelete,
            Events.MessageBulkDelete
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildMessageReactions,
        events: [
            Events.MessageReactionAdd,
            Events.MessageReactionRemove,
            Events.MessageReactionRemoveAll,
            Events.MessageReactionRemoveEmoji
        ]
    },
    {
        intent: IntentsBitField.Flags.GuildMessageTyping,
        events: [
            Events.TypingStart
        ]
    },
    {
        intent: IntentsBitField.Flags.DirectMessages,
        events: [
            Events.MessageCreate,
            Events.MessageUpdate,
            Events.MessageDelete,
            Events.ChannelPinsUpdate
        ]
    },
    {
        intent: IntentsBitField.Flags.DirectMessageReactions,
        events: [
            Events.MessageReactionAdd,
            Events.MessageReactionRemove,
            Events.MessageReactionRemoveAll,
            Events.MessageReactionRemoveEmoji
        ]
    },
    {
        intent: IntentsBitField.Flags.DirectMessageTyping,
        events: [
            Events.TypingStart
        ]
    },
    {
        intent: IntentsBitField.Flags.MessageContent,
        events: []
    },
    {
        intent: IntentsBitField.Flags.GuildScheduledEvents,
        events: [
            Events.GuildScheduledEventCreate,
            Events.GuildScheduledEventUpdate,
            Events.GuildScheduledEventDelete
        ]
    },
    {
        intents: IntentsBitField.Flags.AutoModerationConfiguration,
        events: [
            Events.AutoModerationRuleCreate,
            Events.AutoModerationRuleUpdate,
            Events.AutoModerationRuleDelete
        ]
    },
    {
        intents: IntentsBitField.Flags.AutoModerationExecution,
        events: [
            Events.AutoModerationActionExecution
        ]
    }
];