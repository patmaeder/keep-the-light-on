export default class Sound {
    init() {
        const audio = document.querySelector("audio");
        audio.volume = 0.2;
        audio.loop = true;
        audio.play();
    }
}