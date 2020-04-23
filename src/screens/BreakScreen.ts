import {Screens} from "./Screens";

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
        super.switchVisibleStatus();
    }
}