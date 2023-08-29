require('dotenv').config();

module.exports = Object.freeze({
    DISCORD_TOKEN: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : null,
    DISCORD_BOT_OWNER: process.env.DISCORD_BOT_OWNER ? process.env.DISCORD_BOT_OWNER : null,
    INVITE_LINK: process.env.DISCORD_BOT_INVITE_LINK ? process.env.DISCORD_BOT_INVITE_LINK : null,
    FEEDBACK_EMAIL: process.env.FEEDBACK_EMAIL ? process.env.FEEDBACK_EMAIL : null,
    FEEDBACK_EMAIL_PASSWORD: process.env.FEEDBACK_EMAIL_PASSWORD ? process.env.FEEDBACK_EMAIL_PASSWORD : null,


    USER_AGENT: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",

    EPIC_ENDPOINT_API: "https://store-content-ipv4.ak.epicgames.com/api/en-US/content/products/",
    EPIC_PURCHASE_1: "https://store.epicgames.com/purchase?highlightColor=000000&offers=1-",
    EPIC_PURCHASE_2: "&orderId&purchaseToken#/purchase/payment-methods",
    EPIC_GRAPHQL: "https://store.epicgames.com/graphql",
    EPIC_FREE_ASSETS_ENDPOINT: 'https://www.unrealengine.com/marketplace/api/assets?lang=en-US&start=0&count=20&sortBy=effectiveDate&sortDir=DESC&tag[]=4910',
    EPIC_FREE_ENDPOINT: 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions',
    EPIC_PRODUCT_ENDPOINT: 'https://www.epicgames.com/store/fr/product',

    GOG_SEARCH_ENDPOINT: "https://embed.gog.com/games/ajax/filtered?mediaType=game&search=",
    GOG_MAIN_ENDPOINT: 'https://www.gog.com',
    GOG_API_ENDPOINT: 'https://api.gog.com',
    GOG_IMAGE_ENDPOINT: "https://images.gog-statics.com",
    GOG_CLAIM_ENDPOINT: "https://www.gog.com/giveaway/claim",

    STEAMDB_FREE_ENDPOINT: 'https://steamdb.info/upcoming/free/',
    STEAM_PRODUCT_PAGE_ENDPOINT: 'https://store.steampowered.com/app',
    STEAM_PRODUCT_INFO_ENDPOINT: 'https://store.steampowered.com/api/appdetails/?appids=',
    LAUNCHER: {
        STEAM: 1,
        EPIC: 2,
        GOG: 3,
    },

    LOG_TYPE: {
        ERROR: 'error',
        NEW_GUILD: 'new_guild',
        NEW_TEXT_CHANNEL: 'new_text_channel',
        NEW_FREE_GAME: 'new_free_game',
        GUILD_KICK: 'guild_kick',
        COMMAND: 'command',
        DL_LOG: 'logs_download',
        OTHER: 'other',
    },

    SLASH_COMMANDS: [
        {
            name: "ping",
            description: [
                {
                    language: 'en-US',
                    text: "Ping the bot."
                },
                {
                    language: 'fr',
                    text: "Ping le bot."
                }
            ],
            options: [],
            dm: true,
        },
        {
            name: "total",
            description: [
                {
                    language: 'en-US',
                    text: "Display the total amount (€) of the given games.",
                },
                {
                    language: 'fr',
                    text: "Affiche le montant total (€) des jeux donnés.",
                }
            ],
            options: [],
            dm: false,
        },
        {
            name: "now",
            description: [
                {
                    language: 'en-US',
                    text: "Displays the current free game(s).",
                },
                {
                    language: 'fr',
                    text: 'Affiche le ou les jeux gratuits actuels.',
                }
            ],
            options: [],
            dm: false,
        },
        {
            name: "list",
            description: [
                {
                    language: 'en-US',
                    text: "List given games on a specified period. `from` and `to` are dates using the format dd/mm/yyyy.",
                },
                {
                    language: 'fr',
                    text: "Liste les jeux donnés sur un temps donné. `from` et `to` sont des dates sous la forme jj/mm/aaaa.",
                }
            ],
            options: [
                {
                    type: 'string',
                    name: "from",
                    description: [
                        {
                            language: 'en-US',
                            text: "Start date of the period."
                        },
                        {
                            language: 'fr',
                            text: "Date de début de la période."
                        }
                    ],
                    choices: [],
                    required: false,
                },
                {
                    type: 'string',
                    name: "to",
                    description: [
                        {
                            language: 'en-US',
                            text: "End date of the period."
                        },
                        {
                            language: 'fr',
                            text: "Date de fin de la période."
                        }
                    ],
                    choices: [],
                    required: false,
                }
            ],
            dm: true,
        },
        {
            name: "info",
            description: [
                {
                    language: 'en-US',
                    text: "Display the information of a given game.",
                },
                {
                    language: 'fr',
                    text: "Affiche les informations d'un jeu donné.",
                }
            ],
            options: [
                {
                    type: 'number',
                    name: "id",
                    description: [
                        {
                            language: 'en-US',
                            text: "ID of the game."
                        },
                        {
                            language: 'fr',
                            text: "ID du jeu."
                        }
                    ],
                    choices: [],
                    required: true,
                }
            ],
            dm: true,
        },
        {
            name: "channel",
            description: [
                {
                    language: 'en-US',
                    text: "Set the channel where the bot will post the free games.",
                },
                {
                    language: 'fr',
                    text: "Définit le salon où le bot postera les jeux gratuits.",
                }
            ],
            options: [
                {
                    type: 'channel',
                    name: "channel",
                    description: [
                        {
                            language: 'en-US',
                            text: "ID of the channel."
                        },
                        {
                            language: 'fr',
                            text: "ID du salon."
                        }
                    ],
                    choices: [],
                    required: true,
                }
            ],
            dm: false,
        },
        {
            name: "language",
            description: [
                {
                    language: 'en-US',
                    text: "Set the language of the new game notification.",
                },
                {
                    language: 'fr',
                    text: "Définit la langue des notifications des nouveaux jeux.",
                }
            ],
            options: [
                {
                    type: 'string',
                    name: "language",
                    description: [
                        {
                            language: 'en-US',
                            text: "Language of the bot (\"fr\" or \"en\")."
                        },
                        {
                            language: 'fr',
                            text: "Langue du bot (\"fr\" ou \"en\")."
                        }
                    ],
                    choices: [
                        {
                            name: "English",
                            value: "en",
                        },
                        {
                            name: "Français",
                            value: "fr",
                        }
                    ],
                    required: true,
                }
            ],
            dm: true
        },
        {
            name: "invite",
            description: [
                {
                    language: 'en-US',
                    text: "Display the link to invite the bot.",
                },
                {
                    language: 'fr',
                    text: "Affiche le lien pour inviter le bot.",
                }
            ],
            options: [],
            dm: true,
        },
        {
            name: "feedback",
            description: [
                {
                    language: 'en-US',
                    text: "Send a feedback to the bot's owner.",
                },
                {
                    language: 'fr',
                    text: "Envoie un retour au propriétaire du bot.",
                }
            ],
            options: [
                {
                    type: 'string',
                    name: "message",
                    description: [
                        {
                            language: 'en-US',
                            text: "Message to send."
                        },
                        {
                            language: 'fr',
                            text: "Message à envoyer."
                        }
                    ],
                    choices: [],
                    required: true,
                }
            ],
            dm: true,
        },
        {
            name: "changelog",
            description: [
                {
                    language: 'en-US',
                    text: "Manage update notifications (Owner)",
                },
                {
                    language: 'fr',
                    text: "Gère les notifications de mise à jours (Propriétaire)",
                }
            ],
            options: [
                {
                    type: 'string',
                    name: "action",
                    description: [
                        {
                            language: 'en-US',
                            text: "Action to do."
                        },
                        {
                            language: 'fr',
                            text: "Action à effectuer."
                        }
                    ],
                    choices: [
                        {
                            name: "check",
                            value: "check",
                        },
                        {
                            name: "push",
                            value: "push",
                        }
                    ],
                    required: false,
                },
                {
                    type: 'file',
                    name: "file",
                    description: [
                        {
                            language: 'en-US',
                            text: "JSON file to send."
                        },
                        {
                            language: 'fr',
                            text: "Fichier JSON à envoyer."
                        }
                    ],
                    choices: [],
                    required: false,
                }
            ],
            dm: true,
        },
    ],

    COMMAND_DM: {
        prefix: "!",
        cmd: [
            {
                name: "changelog",
                proto: "!changelog [push|check]",
                description: `CMD_DM_CHANGELOG_DESC`,
                inline: false,
            },
            {
                name: "language",
                proto: "!language en|fr",
                description: `CMD_DM_LANGUAGE_DESC`,
                inline: false,
            },
            {
                name: "help",
                proto: "!help [dm]",
                description: `CMD_HELP_DESC`,
                inline: false,
            },
            {
                name: "invite",
                proto: "!invite",
                description: `CMD_INVITE_DESC`,
                inline: false,
            },
            {
                name: "feedback",
                proto: "!feedback MESSAGE",
                description: `CMD_FEEDBACK_DESC`,
                inline: false,
            }
        ]
    },
    COMMAND_DM_ID: {
        NONE: 0,
        CHANGELOG: 1,
        LANGUAGE: 2,
        HELP: 3,
        INVITE: 4,
        FEEDBACK: 5,
    },
    COMMANDS: {
        prefix: "!",
        cmd: [
            {
                name: "total",
                proto: "!total",
                description: `CMD_TOTAL_DESC`,
                inline: false,
            },
            {
                name: "now",
                proto: "!now",
                description: `CMD_NOW_DESC`,
                inline: false,
            },
            {
                name: "list",
                proto: "!list [from] [to]",
                description: `CMD_LIST_DESC`,
                inline: false,
            },
            {
                name: "channel",
                proto: "!channel CHANNEL_ID",
                description: `CMD_CHANNEL_DESC`,
                inline: false,
            },
            {
                name: "language",
                proto: "!language en|fr",
                description: `CMD_LANGUAGE_DESC`,
                inline: false
            },
            {
                name: "help",
                proto: "!help [dm]",
                description: `CMD_HELP_DESC`,
                inline: false,
            },
            {
                name: "info",
                proto: "!info GAME_ID",
                description: `CMD_INFO_DESC`,
                inline: false,
            },
            {
                name: "invite",
                proto: "!invite",
                description: `CMD_INVITE_DESC`,
                inline: false,
            },
            {
                name: "feedback",
                proto: "!feedback MESSAGE",
                description: `CMD_FEEDBACK_DESC`,
                inline: false,
            }
        ]
    },
    COMMAND_ID: {
        NONE: 0,
        TOTAL: 1,
        NOW: 2,
        LIST: 3,
        CHANNEL: 4,
        LANGUAGE: 5,
        HELP: 6,
        INFO: 7,
        INVITE: 8,
        FEEDBACK: 9,
    },
})