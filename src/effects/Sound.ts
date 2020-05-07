export default class Sound {
    constructor(){
        this.init
    }
    init() {
        const audio = document.querySelector("audio");
        audio.volume = 0.2;
        audio.loop = true;
        audio.play();
    }
}