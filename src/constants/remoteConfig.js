// MARK: Static
export const REMOTE_CONFIG_KEY = {
    community_id: "community_id",
    llm_prompt: "llm_prompt"
}


// MARK: Variable
export const Config = { 
    community_id: [],
    llm_prompt: []
};


// MARK: Community Handler
export const Community = {
    getChannelNameByChannelId(channelId) {
        if (!Array.isArray(Config.community_id)) {
            throw new Error('Community data is not loaded.');
        }

        for (const guild of Config.community_id) {
            if (Array.isArray(guild.category)) {
                for (const category of guild.category) {
                    if (Array.isArray(category.channel)) {
                        const channel = category.channel.find(ch => ch.id == channelId);
                        if (channel) {
                            return channel.name;
                        }
                    }
                }
            }
        }

        throw new Error('Channel ID not found in any guild.');
    },

    getGuildNameByChannelId(channelId) {
        if (!Array.isArray(Config.community_id)) {
            throw new Error('Community data is not loaded.');
        }

        for (const guild of Config.community_id) {
            if (Array.isArray(guild.category)) {
                for (const category of guild.category) {
                    if (Array.isArray(category.channel)) {
                        const channel = category.channel.find(ch => ch.id == channelId);
                        if (channel) {
                            return guild.name;
                        }
                    }
                }
            }
        }

        throw new Error('Channel ID not found in any guild.');
    },
    
    getChannelHandleTypeByChannelId(channelId) {
        if (!Array.isArray(Config.community_id)) {
            throw new Error('Community data is not loaded.');
        }

        for (const guild of Config.community_id) {
            if (Array.isArray(guild.category)) {
                for (const category of guild.category) {
                    if (Array.isArray(category.channel)) {
                        const channel = category.channel.find(ch => ch.id == channelId);
                        if (channel) {
                            return channel.handleType;
                        }
                    }
                }
            }
        }

        throw new Error('Channel ID not found in any guild.');
    }
};
