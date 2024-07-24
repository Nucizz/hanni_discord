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
    getGuildById(id) {
        if (!Array.isArray(Config.community_id)) {
            throw new Error('Guild data is not loaded.');
        }
        return Config.community_id.find(guild => guild.id == id);
    },

    getCategoryById(guild, categoryId) {
        if (!guild || !Array.isArray(guild.category)) {
            throw new Error('Guild not found or guild categories are not loaded.');
        }
        return guild.category.find(category => category.id == categoryId);
    },

    getChannelById(category, channelId) {
        if (!category || !Array.isArray(category.channel)) {
            throw new Error('Category not found or category channels are not loaded.');
        }
        return category.channel.find(channel => channel.id == channelId);
    },

    getGuildByName(name) {
        if (!Array.isArray(Config.community_id)) {
            throw new Error('Community data is not loaded.');
        }
        return Config.community_id.find(community => community.name == name);
    },

    getCategoryByName(community, name) {
        if (!community || !Array.isArray(community.category)) {
            throw new Error('Community not found or community categories are not loaded.');
        }
        return community.category.find(category => category.name == name);
    },
    
    getChannelByName(category, name) {
        if (!category || !Array.isArray(category.channel)) {
            throw new Error('Category not found or category channels are not loaded.');
        }
        return category.channel.find(channel => channel.name == name);
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
