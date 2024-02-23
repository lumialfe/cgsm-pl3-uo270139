const url = "http://localhost:8080/assets/sintel_trailer.mpd";
const player = dashjs.MediaPlayer().create();
player.initialize(document.querySelector("#player"), url, true);