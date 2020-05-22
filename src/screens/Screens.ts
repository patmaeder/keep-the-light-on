export class Screens {
    protected screen = document.createElement("DIV");
    protected visible: boolean = false;
    private buttons = document.createElement("DIV");
    private stats = document.createElement("DIV");

    constructor(title: string, imgUrl?: string) {
        this.screen.id = "screen";
        this.buttons.id = "menu";
        if (imgUrl) {
            this.setImage(imgUrl);
        }
        this.setTitle(title);
        this.screen.appendChild(this.buttons);
        document.body.appendChild(this.screen);
    }

    switchVisibleStatus() {
        if (this.visible) {
            this.screen.style.display = "none";
            this.visible = false;
        } else {
            this.screen.style.display = "block";
            this.visible = true;
        }
    }

    addButton(text, id, click) {
        let p = document.createElement("P");
        let button = document.createElement("BUTTON");
        button.appendChild(document.createTextNode(text));
        button.id = id;
        button.onclick = click;
        p.appendChild(button);
        this.buttons.appendChild(p);
    }

    setStatsBar(totalTime: string, totalLights: number, timeLeft: number) {
        let side = document.createElement("aside");

        let time = document.createElement("P");
        time.appendChild(document.createTextNode(totalTime + " played"));
        let lights = document.createElement("P");
        lights.appendChild(document.createTextNode(totalLights + " total lights collected"));
        let left = document.createElement("P");
        left.appendChild(document.createTextNode(timeLeft + " time left"));

        side.appendChild(time);
        side.appendChild(lights);
        side.appendChild(left);
        side.id = "stats";
        this.screen.appendChild(side);
    }

    isVisible(): boolean {
        return this.visible;
    }

    private setImage(imgUrl) {
        let image = document.createElement("IMG");
        image.setAttribute("src", imgUrl);
        this.screen.appendChild(image);
    }

    private setTitle(title) {
        let titleElement = document.createElement("H1");
        titleElement.appendChild(document.createTextNode(title));
        this.screen.appendChild(titleElement);
    }
}
