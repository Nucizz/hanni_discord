import { generateDependencyReport } from '@discordjs/voice';
import { log, overrideConsoleLog } from './src/helper/loggerHelper.js';
import { initRemoteConfigData } from './src/api/firebase/firebaseRemoteConfig.js';
import { initDiscordSocket } from './src/api/discord/discordConfig.js';
import { testFirestoreAccess } from './src/api/firebase/firebaseFirestore.js';


// MARK: Setup init
await initApp();


// MARK: On process
process.on('unhandledRejection', error => {
    log(['PROCESS'], error.message, true);
});


// MARK: Helper
async function initApp() {
    console.clear();

    try {
        generateDependencyReport();
        overrideConsoleLog();
        initRemoteConfigData();
        await testFirestoreAccess();
        initDiscordSocket();
    } catch {
        process.exit(1);
    }
}