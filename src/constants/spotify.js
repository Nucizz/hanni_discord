export const SpotifyPlaylist = [
    "'untitled¿' - For trending songs, especially those popular on TikTok: https://open.spotify.com/playlist/2SGo6XCC93tDz999hFABhB?si=0bdb8f21288b4297",
    "'k-puppies♥' - For upbeat K-pop, featuring girl groups and boy groups like NewJeans, BlackPink, and BTS: https://open.spotify.com/playlist/3TpZo0GwxZvfSRmm4WFh9f?si=0ffd71e6b3aa4ea1",
    "'bibimbap.' - For ballad K-pop and K-drama OSTs, including artists like IU, Punch, and Taeyeon: https://open.spotify.com/playlist/2lsXLPthbEL4ccLKnzvhaM?si=4537c2409e824173",
    "'nusantara.' - For Indonesian songs: https://open.spotify.com/playlist/65KxXUyN9hAFZ4X9q5imGe?si=c0876219b6da465f",
    "'metroo!.' - For hip hop and rap tracks featuring artists like Lil Uzi Vert, Eminem, and Kanye West: https://open.spotify.com/playlist/4azw2gKcHtj1xL9h4G6wrm?si=4d9ef159494f44ec",
    "'starboy✰' - For a dark and cool vibe, featuring artists like The Weeknd and Drake: https://open.spotify.com/playlist/10STU5ZzzaMLe45KH9VBHe?si=b5b1d46a8e1f4799",
    "'elevated✈' - For RnB/Soul and relaxing vibes, including artists like Daniel Caesar: https://open.spotify.com/playlist/0NeI83yroGuDJLt0fCinKV?si=3e5fbaf0c80e48b2",
    "'xoxos❀' - For modern RnB and alternative tracks, featuring artists like keshi and schld: https://open.spotify.com/playlist/0uMFfBYyC19vC6u0oxc3N0?si=b4c457a31b6a46ea",
    "'llabasel⛄' - For slow jazz-pop vibes, featuring artists like Frank Sinatra and Michael Bublé: https://open.spotify.com/playlist/0TEUdYTmgMXCdM21AHSMBN?si=ef3ded6b20654f35"
]

export function isPlayCommand(response) {
    return response.startsWith("m!p ")
}