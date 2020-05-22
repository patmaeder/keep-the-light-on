//###############################################################################Start: Laurin Dörre
import {Screens} from "./Screens";
import {introScreen1, introScreen2, toggleBackgroundSound, toggleBreak} from "../index";
import {toggleCubeSound} from "../beans/Cube";

export class BreakScreen extends Screens {
    constructor() {
        super("Break");
        this.initButtons()
    }

    private initButtons() {
        super.addButton("resume", "resume", () => {
            super.switchVisibleStatus();
            toggleBreak();
        });
        super.addButton("toggle sound", "resume", () => {
            toggleBackgroundSound();
            toggleCubeSound();
        });
        super.addButton("main menu", "backToMain", () => {
            location.reload();
        });
        //###############################################################################Start: Patrick Mäder
        super.addButton("Game Introduction", "gameIntroduction", async () => {
            super.switchVisibleStatus();
            await new Promise((resolve, reject) => {
                introScreen1.switchVisibleStatus();
                let interval = setInterval(() => {
                    if (!introScreen1.isVisible() && !introScreen2.isVisible()) {
                        resolve();
                        clearInterval(interval);
                    }
                }, 100)
            });
            super.switchVisibleStatus();
        });
        //###############################################################################Ende: Patrick Mäder
    }
}
//###############################################################################Ende: Laurin Dörre