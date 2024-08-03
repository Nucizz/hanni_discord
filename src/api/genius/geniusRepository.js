import { log } from "../../helper/loggerHelper.js";
import { geniusClient } from "./geniusConfig.js";

export async function getLyrics(title) {
    try {
        log(["GENIUS", "LYRICS"], `Fetching ${title} lyrics from Genius.`);
        const response = await geniusClient.songs.search(title);
        const lyrics = await response[0].lyrics();

        log(["GENIUS", "LYRICS"], `Found ${title} lyrics at Genius.`);
        return `Found lyrics of ${response[0].fullTitle} provided by Genius.\n${lyrics}`;
    } catch (error) {
        log(["GENIUS", "LYRICS"], `No ${title} lyrics found at Genius.`, true);
        return null;
    }
}