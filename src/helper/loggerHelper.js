// MARK: Setup init
export function overrideConsoleLog() {
    console.log = function(content) {
        // process.stdout.write(`[DEBUG] ${content}\n`);
    };
    console.error = function(content) {
        // process.stdout.write(`[DEBUG] ${content}\n`);
    };
    log(["START", "CONFIGURE_SYSTEM"], "Overrided default console log");
}


// MARK: Helper
export function log(sources, content, isError = false) {
    const formattedSource = sources.map(source => {
        return `[${source.toUpperCase()}]`
    }).join('');

    if (isError) {
        process.stdout.write(`\x1b[31m[ERROR]${formattedSource} ${content}\n`);
    } else {
        process.stdout.write(`\x1b[34m${formattedSource}\x1b[0m ${content}\n`);
    }
}