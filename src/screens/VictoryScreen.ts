import {Screens} from "./Screens";
import {toggleBackgroundSound} from "../index";
import {toggleCubeSound} from "../beans/Cube";

export class VictoryScreen extends Screens {
    constructor(totalTime: string, totalLights: number, timeLeft: number) {
        super("You Won");
        this.initButtons();
        this.initSide(totalTime, totalLights, timeLeft);
    }

    private initButtons() {
        super.addButton("restart", "resume", () => {
            super.switchVisibleStatus();
            location.reload();
        });
        super.addButton("toggle sound", "resume", () => {
            toggleBackgroundSound();
            toggleCubeSound();
        });
        super.addButton("Main Menu", "backToMain", () => {
            location.reload();
        });
    }

    private initSide(totalTime: string, totalLights: number, timeLeft: number) {
        super.setStatsBar(totalTime, totalLights, timeLeft);
    }
}