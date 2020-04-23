import {Screens} from "./Screens";

export class BreakScreen extends Screens{
    constructor() {
        super("Break");
        this.initButtons()
    }
    private initButtons(){
        super.addButton("resume","resume");
    }

    switchVisibleStatus(){
        super.switchVisibleStatus();
    }
}