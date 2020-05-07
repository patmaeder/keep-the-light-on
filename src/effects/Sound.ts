const backgroundMusic = document.querySelector("audio");

export default class Sound {
    constructor(){
        this.init()

    }
    init() {
        backgroundMusic.volume = 0.2;
        backgroundMusic.loop = true;
        toggleBackgroundMusic()
    }
} 

export function toggleBackgroundMusic() {
    return backgroundMusic.paused ? backgroundMusic.play() : backgroundMusic.pause();
}