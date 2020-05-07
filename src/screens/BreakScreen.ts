import {Screens} from "./Screens";
import { timer } from "..";
import {toggleBackgroundMusic} from "../effects/Sound";

export class BreakScreen extends Screens{
    constructor() {
        super("Break");
        this.initButtons()
    }
    private initButtons(){
        super.addButton("resume","resume", () => {
            super.switchVisibleStatus();
        });
        super.addButton("toggle sound","resume", () => {
            toggleBackgroundMusic();
        });
    }
}