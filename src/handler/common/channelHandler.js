export async function clearChannel(channel) {
    let fetched;
    do {
        fetched = await channel.messages.fetch({ limit: 99 });
        if (fetched.size > 0) {
            await channel.bulkDelete(fetched, true);
        }
    } while (fetched.size >= 99);
}