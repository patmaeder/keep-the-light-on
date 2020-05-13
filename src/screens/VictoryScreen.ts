import {Screens} from "./Screens";
import {toggleBackgroundMusic} from "../effects/Sound";

export class VictoryScreen extends Screens{
    constructor(totalTime: number, totalLights: number, timeLeft: number) {
        super("You Lost");
        this.initButtons();
        this.initSide(totalTime,totalLights,timeLeft);
    }
    private initButtons(){
        super.addButton("restart","resume", () => {
            super.switchVisibleStatus();
            location.reload();
        });
        super.addButton("toggle sound","resume", () => {
            toggleBackgroundMusic();
        });
        super.addButton("Main Menu","backToMain", () => {
            location.reload();
        });
    }
    private initSide(totalTime: number, totalLights: number, timeLeft: number){
        super.setStatsBar(totalTime,totalLights,timeLeft);
    }
}