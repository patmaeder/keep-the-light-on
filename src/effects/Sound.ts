
import {
    AudioLoader, Audio, AudioListener
  } from "three";


export default class Sound {
    // create an AudioListener and add it to the camera


    private listener = new AudioListener();
    private audioLoader = new AudioLoader();
    private sound: Audio;
    constructor(camera, src:string){
        camera.add( this.listener );
        this.sound = new Audio( this.listener );
        this.initSound(src);
        
    }
    

   
    

 // load a sound and set it as the Audio object's buffer
 // './assets/music/Melt-Down_Looping.mp3'

   private initSound(src:string){
    this.audioLoader.load( src, function( buffer ) {
        this.sound.setBuffer( buffer );
        this.sound.setLoop( true );
        this.sound.setVolume( 0.2 );
        this.sound.play();
    });
   }

}
   







//{
//    constructor(){
//        this.init()
//
//    }
//    init() {
//        const audio = document.querySelector("audio");
//        audio.volume = 0.2;
//        audio.loop = true;
 //       audio.play();
 //   }
//}

