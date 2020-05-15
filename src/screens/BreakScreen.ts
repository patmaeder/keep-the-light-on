import {Screens} from "./Screens";
import {toggleMusic} from "../effects/Sound";
import {introScreen1, introScreen2, toggleBreak} from "../index";

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
            toggleMusic();
        });
        super.addButton("main menu", "backToMain", () => {
            location.reload();
        });
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
    }
}