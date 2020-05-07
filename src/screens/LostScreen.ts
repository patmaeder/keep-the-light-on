import {Screens} from "./Screens";
import {toggleBackgroundMusic} from "../effects/Sound";

export class LostScreen extends Screens{
    constructor() {
        super("You Lost");
        this.initButtons()
    }
    private initButtons(){
        super.addButton("restart","resume", () => {
            super.switchVisibleStatus();
            //TODO Restart Game
        });
        super.addButton("toggle sound","resume", () => {
            toggleBackgroundMusic();
        });
    }
}