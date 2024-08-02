import Genius from "genius-lyrics";
import { config as envConfig } from "dotenv";


// MARK: Config
envConfig();
export const geniusClient = new Genius.Client(process.env.GENIUS_API_KEY);