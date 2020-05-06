import {Screens} from "./Screens";
import { timer } from "..";

export class BreakScreen extends Screens{
    constructor() {
        super("Break");
        this.initButtons()
    }
    private initButtons(){
        super.addButton("resume","resume", function () {
            //add function here
            console.log("Resume")
        });
    }

    switchVisibleStatus(){
        if (this.visible) {
            this.screen.style.display = "none";
            this.visible = false;
            timer.resume();
        } else {
            this.screen.style.display = "block";
            this.visible = true;
            timer.pause();
        }
    }
}