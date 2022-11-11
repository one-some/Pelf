const Cover = $el("#cover");
const Sound = $el("#sound");
const Uploader = $el("#upload");
const SongContainer = $el("#song-container");

const Playbar = {
    title: $el("#playbar-title"),
    artist: $el("#playbar-artist"),
    album: $el("#playbar-album"),
}

var songs = [];

function createSongEntry(
    songTitle,
    songArtist,
    songDuration,
    songAlbum,
    blobUrl,
) {
    let index = songs.push({
        title: songTitle,
        artist: songArtist,
        duration: songDuration,
        album: songAlbum,
        blobUrl: blobUrl,
    }) - 1;

    const div = $e("div", SongContainer, {classes: ["song-card"], "song-index": index});
    const upperContainer = $e("div", div, {classes: ["song-card-upper"]});
    const lowerContainer = $e("div", div, {classes: ["song-card-lower"]});

    const titleEl = $e("span", upperContainer, {innerText: songTitle, classes: ["song-title"]});

    // TODO
    let duration = "13:37";

    const durationEl = $e("span", upperContainer, {innerText: ` (${duration})`, classes: ["song-duration"]});


    const artistEl = $e("span", lowerContainer, {innerText: songArtist, classes: ["song-artist"]});
    const albumEl = $e("span", lowerContainer, {innerText: songAlbum, classes: ["song-album"]});


    div.addEventListener("click", async function() {
        await playSong(index)
    });
    return index;
}

async function playSong(songIndex) {
    let song = songs[songIndex];
    Playbar.album.innerText = song.album;
    Playbar.artist.innerText = song.artist;
    Playbar.title.innerText = song.title;

    Sound.src = song.blobUrl;
    // TODO: Custom thingey
    Sound.volume = 0.6;
    Sound.play();

    let songBlob = await fetch(song.blobUrl).then(r => r.blob());

    jsmediatags.read(songBlob, {
        onSuccess: async function(tag) {
            console.log(tag);
            let tags = tag.tags;
            let coverBlob = new Blob([new Uint8Array(tags.picture.data)], {type: tags.picture.format});
            Cover.src = await blob2b64(coverBlob);
        },
        onError: function(error) {
            console.error(error);
        }
    });
}

async function blob2b64(blob) {
    let reader = new FileReader();
    reader.readAsDataURL(blob); 

    return new Promise(function(resolve, reject) {
        reader.onloadend = function() {
            base64data = reader.result;     
            resolve(reader.result);
        }
    })
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
    if (!files.length) return;

    for (const file of files) {
        const songData = songDataFromFilePath(file.webkitRelativePath);
        createSongEntry(
            songData.title,
            songData.artist,
            songData.duration,
            songData.album,
            URL.createObjectURL(file)
        )
    }
}

if (Uploader.files) processFiles(Uploader.files);

/* Upload */
Uploader.addEventListener("input", function(event) {
    processFiles(Uploader.files);
})