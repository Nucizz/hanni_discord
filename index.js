import { generateDependencyReport } from '@discordjs/voice';
import { overrideConsoleLog } from './src/helper/logger.js';
import { initRemoteConfigData } from './src/api/firebase/firebaseRemoteConfig.js';
import { initDiscordSocket } from './src/api/discord/discordConfig.js';
import { testFirestoreAccess } from './src/api/firebase/firebaseFirestore.js';


// MARK: Setup init
initApp();


// MARK: On process
// process.on('unhandledRejection', error => {
//     log(["PROCESS"], error.message, true);
// });


// MARK: Helper
function initApp() {
    console.clear();

    try {
        generateDependencyReport();
        overrideConsoleLog();
        initRemoteConfigData();
        testFirestoreAccess();
        initDiscordSocket();
    } catch {
        process.exit(1);
    }
}