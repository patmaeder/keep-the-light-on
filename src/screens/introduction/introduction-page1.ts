//###############################################################################Start: Patrick Mäder
import {Introduction} from "./introduction";
//###############################################################################Ende: Patrick Mäder
//###############################################################################Start: Calvin Reibenspieß
import ArrowKeys from "../../../assets/icons/ArrowKeys.svg";
import WASD from "../../../assets/icons/WASD.svg";
import Space from "../../../assets/icons/space.svg";
import Mouse from "../../../assets/icons/mouse.svg";
import Esc from "../../../assets/icons/esc.svg";
//###############################################################################Ende: Calvin Reibenspieß

export class IntroPage1 extends Introduction {
    //###############################################################################Start: Patrick Mäder
    constructor(title: string, heading: string) {
        super(title, heading);
        this.generateContent();
    }

    generateContent() {
        //src Attribute der folgenden img Tags geupdated von Calvin Reibenspieß
        this.wrapper.innerHTML = `<div>
                <img src="${ArrowKeys}" class="imgLeft"></img>
                <p>Mithilfe der Pfeiltasten auf deiner Tastatur kannst du deine Spielfigur bewegen. </p>
            </div>
            <div>
                <img src="${WASD}" class="imgLeft"></img>
                <p>Für eine alternative Steuerung kannst du auch auf die Tasten W, A, S und D zurückgreifen.</p>          
            </div>
            <div>
                <img src="${Space}" class="imgLeft"></img>
                <p>Um mit deiner Spielfigur über Hindernisse springen zu können muss du die Leertaste drücken.</p>          
            </div>
            <div>
                <img src="${Mouse}" class="imgLeft"></img>
                <p>Bewege deine Maus nach links und rechts um dich um den Würfel zu drehen. Du wirst sehen, deine Bewegungsrichtung passt sich immer deinem Sichtfeld an.</p>          
            </div>
            <div>
                <img src="${Esc}" class="imgLeft"></img>
                <p>Um das Spiel zu pausieren, die Hintergrundmusik zu dekativieren oder um die Spielanleitung erneut aufzurufen, kannst du mithilfe der Escape-Taste zum Pausenmenü wechseln.</p>          
            </div>`;
    }
    //###############################################################################Start: Patrick Mäder
}
