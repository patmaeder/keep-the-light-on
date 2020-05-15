import { Screens } from "./Screens";
import { toggleMusic } from "../effects/Sound";
import androidIcon from "../../assets/favicon/android-chrome-256x256.png";

export class StartScreen extends Screens {
    constructor() {
        //TODO relative Path to Image
        super("Keep the light on", androidIcon);
    }

    public initButtons() {
        super.addButton("toggle sound", "sound", () => {
            toggleMusic();
        });
    }
}