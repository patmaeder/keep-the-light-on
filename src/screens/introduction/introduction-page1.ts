import {Introduction} from "./introduction";

export class IntroPage1 extends Introduction{
    constructor(title: string, heading: string) {
        super(title, heading);
        this.generateContent();
    }

    generateContent() {
        this.wrapper.innerHTML =
            `<div>
                <img src="./ArrowKeys.svg" class="imgLeft"></img>
                <p>Mithilfe der Pfeiltasten auf deiner Tastatur kannst du deine Spielfigur bewegen. </p>
            </div>
            <div>
                <img src="./WASD.svg" class="imgLeft"></img>
                <p>Für eine alternative Steuerung kannst du auch auf die Tasten W, A, S und D zurückgreifen.</p>          
            </div>
            <div>
                <img src="./space.svg" class="imgLeft"></img>
                <p>Um mit deiner Spielfigur über Hindernisse springen zu können muss du die Leertaste drücken.</p>          
            </div>
            <div>
                <img src="./mouse.svg" class="imgLeft"></img>
                <p>Bewege deine Maus nach links und rechts um dich um den Würfel zu drehen. Du wirst sehen, deine Bewegungsrichtung passt sich immer deinem Sichtfeld an.</p>          
            </div>
            <div>
                <img src="./esc.svg" class="imgLeft"></img>
                <p>Um das Spiel zu pausieren, die Hintergrundmusik zu dekativieren oder um die Spielanleitung erneut aufzurufen, kannst du mithilfe der Escape-Taste zum Pausenmenü wechseln.</p>          
            </div>`;
    }
}