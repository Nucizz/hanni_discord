export async function clearChannel(channel) {
    const fetched = await channel.messages.fetch({limit: 99});
    channel.bulkDelete(fetched);
}