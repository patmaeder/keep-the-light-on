import {Screens} from "./Screens";
import {toggleMusic} from "../effects/Sound";

export class VictoryScreen extends Screens {
    constructor(totalTime: string, totalLights: number, timeLeft: number) {
        super("You Lost");
        this.initButtons();
        this.initSide(totalTime, totalLights, timeLeft);
    }

    private initButtons() {
        super.addButton("restart", "resume", () => {
            super.switchVisibleStatus();
            location.reload();
        });
        super.addButton("toggle sound", "resume", () => {
            toggleMusic();
        });
        super.addButton("Main Menu", "backToMain", () => {
            location.reload();
        });
    }

    private initSide(totalTime: string, totalLights: number, timeLeft: number) {
        super.setStatsBar(totalTime, totalLights, timeLeft);
    }
}