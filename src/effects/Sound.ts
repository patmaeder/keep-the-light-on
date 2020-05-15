import { AudioLoader, Audio, AudioListener } from "three";

export default class Sound {
  private listener = new AudioListener();
  private audioLoader = new AudioLoader();
  private sound: Audio;
  constructor(camera, src: string) {
    camera.add(this.listener);
    this.sound = new Audio(this.listener);
    this.initSound(src);
  }
  //Background musik  './assets/music/Melt-Down_Looping.mp3'
  private initSound(src: string) {
    console.log(src);
    this.audioLoader.load(
      src,
      function (buffer) {
        this.sound.setBuffer(buffer);
        this.sound.setVolume(0.5);
        this.sound.play();
      }.bind(this)
    );
  }
  public setPlaybackSpeed(rate: number){
      this.sound.setPlaybackRate(rate);
  }
  public setLoop(loop: boolean){
        this.sound.setLoop(loop);
    }
    public play(){
        this.sound.play();
    }
    public pause(){
        this.sound.pause();
    }
}
export function toggleMusic() {
    this.sound.isPlaying ?  this.sound.play() :  this.sound.pause();
}