import {Audio, AudioListener, AudioLoader} from "three";

export default class Sound {
    private listener = new AudioListener();
    private audioLoader = new AudioLoader();
    private sound: Audio;

    constructor(camera, src: string) {
        camera.add(this.listener);
        this.sound = new Audio(this.listener);
        this.initSound(src);
    }

    public setPlaybackSpeed(rate: number) {
        this.sound.setPlaybackRate(rate);
    }

    public setVolume(volume: number) {
        this.sound.setVolume(volume);
    }

    public setLoop(loop: boolean) {
        this.sound.setLoop(loop);
    }

    public play() {
        this.sound.play();
    }

    public pause() {
        this.sound.pause();
    }

    public isPlaying(): boolean {
        return this.sound.isPlaying;
    }

    private initSound(src: string) {
        this.audioLoader.load(
            src,
            function (buffer) {
                this.sound.setBuffer(buffer);
                this.sound.setVolume(0.5);
                this.sound.play();
            }.bind(this)
        );
    }
}

export function toggleMusic() {
    this.sound.isPlaying ? this.sound.play() : this.sound.pause();
}