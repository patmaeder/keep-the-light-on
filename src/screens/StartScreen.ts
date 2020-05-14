import {Screens} from "./Screens";
import {toggleBackgroundMusic} from "../effects/Sound";

export class StartScreen extends Screens{
    constructor() {
        //TODO relative Path to Image
        super("Keep the light on", "./android-chrome-256x256.e6d133d3.png");
    }
    public initButtons(){
        super.addButton("toggle sound","sound", () => {
            toggleBackgroundMusic();
        });
    }

}
