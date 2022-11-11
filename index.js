const Uploader = $el("#upload");
const SongContainer = $el("#song-container");

function createSongEntry(
    songTitle,
    songArtist,
    songDuration,
    songAlbum,
) {
    const div = $e("div", SongContainer, {classes: ["song-card"]});
    const upperContainer = $e("div", div, {classes: ["song-card-upper"]});
    const lowerContainer = $e("div", div, {classes: ["song-card-lower"]});

    const titleEl = $e("span", upperContainer, {innerText: songTitle, classes: ["song-title"]});

    // TODO
    let duration = "13:37";

    const durationEl = $e("span", upperContainer, {innerText: ` (${duration})`, classes: ["song-duration"]});


    const artistEl = $e("span", lowerContainer, {innerText: songArtist, classes: ["song-artist"]});
    const albumEl = $e("span", lowerContainer, {innerText: songAlbum, classes: ["song-album"]});
}

function songDataFromFilePath(path) {
    // Remove file extension
    let parts = path.split("/");
    let songName = parts.slice(-1)[0];
    songName = songName.split(".").slice(0, -1).join(".");

    return {
        title: songName,
        artist: "Unknown",
        duration: 12,
        album: parts.slice(0, -1).join(" - "),
    }
}

function processFiles(files) {
    for (const file of files) {
        const songData = songDataFromFilePath(file.webkitRelativePath);
        createSongEntry(
            songData.title,
            songData.artist,
            songData.duration,
            songData.album,
        )
    }
}

if (Uploader.files) processFiles(Uploader.files);

/* Upload */
Uploader.addEventListener("input", function(event) {
    processFiles(Uploader.files);
})