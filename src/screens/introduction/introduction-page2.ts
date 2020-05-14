import {Introduction} from "./introduction";

export class IntroPage2 extends Introduction{
    constructor(title: string, heading: string) {
        super(title, heading);
        this.generateContent();
    }

    generateContent() {
        this.wrapper.innerHTML =
            `<img src="./game.svg" id="imgBig"></img>
            <p id="teaserText">Bringe den kleinen Würfel sicher ins Ziel bevor deine Zeit abgelaufen ist. Der Ablauf der Zeit wird in der Leiste am oberen 
                Bildschirmrand visualisiert. <br> Um dir mehr Zeit auf dem Weg in die Freiheit zu verschaffen, sammle kleine, leuchtende Würfel, sogenannte Lichter, ein.
                 Diese verschaffen dir ein Plus an Zeit. Wie viele Lichter du bereits gesammelt hast, kannst du an der Anzeige in der oberen linken Ecke des Bildschirms ablesen.
                 <br>Nur wenn du das magisch leuchtende Portal vor Ablauf der Zeit erreichst, entfliehst du der Dunkelheit. 
                  <br>Auf deinem Weg begegnest du zahlreichen Hindernissen und tiefen Schluchten, deren Überwindung kostbare Zeit erfordert.
            </p>
            <h2>Beeil dich!</h2>`;
    }
}
