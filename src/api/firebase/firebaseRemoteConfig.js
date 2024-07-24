import { Config, REMOTE_CONFIG_KEY } from "../../constants/remoteConfig.js";
import { log } from "../../helper/loggerHelper.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const community_id = require("../../../json/community_id.json");
const llm_prompt = require("../../../json/llm_prompt.json");


// MARK: Init config
export function initRemoteConfigData() {
    try {
        fetchCommunityIdConfig();
        fetchLLMPromptConfig();
    } catch (error) {
        log(["START", "CONFIG"], error, true);
        throw error;
    }
}


// MARK: Fetch config
function fetchCommunityIdConfig() {
    try {
        if (!Array.isArray(community_id)) {
            throw new Error("community_id is not an array");
        }
        
        Config.community_id = community_id
        log(["START", "CONFIG", "COMMUNITY_ID"], 'Fetched Community Id config successfully.');
    } catch (error) {
        log(["START", "CONFIG", "COMMUNITY_ID"], error, true);
        throw error;
    }
}

function fetchLLMPromptConfig() {
    try {
        const llmPromptConfig = llm_prompt;
        log(["START", "CONFIG", "LLM_PROMPT"], 'Fetched LLM Prompt config successfully.');

        Config.llm_prompt = llmPromptConfig.map(item => {
            const title = Object.keys(item)[0];
            const message = item[title];
            return `**${title}**\n${message}`;
        });
    } catch (error) {
        log(["START", "CONFIG", "LLM_PROMPT"], error, true);
        throw error;
    }
}


