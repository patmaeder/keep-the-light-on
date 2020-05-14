import {
    AudioLoader, Audio, AudioListener
  } from "three";

export default class Sound {

    private listener = new AudioListener();
    private audioLoader = new AudioLoader();
    private sound: Audio;
    constructor(camera, src:string){
        camera.add( this.listener );
        this.sound = new Audio( this.listener );
        this.initSound(src);
        
    }
 //Background musik  './assets/music/Melt-Down_Looping.mp3'
   private initSound(src:string){
    this.audioLoader.load( src, function( buffer ) {
        this.sound.setBuffer( buffer );
        this.sound.setLoop( true );
        this.sound.setVolume( 0.2 );
        this.sound.play();
    });
   }
  toggleBackgroundMusic() {
     this.sound.paused ?  this.sound.play() :  this.sound.pause();
   }
}