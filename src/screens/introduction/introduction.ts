export class Introduction {
    protected screen = document.createElement("DIV");
    protected wrapper = document.createElement("DIV");
    protected visible: boolean = false;
    private buttons = document.createElement("DIV");

    constructor(title: string, heading: string) {
        this.screen.id = "screen";
        this.wrapper.id = "wrapper";
        this.buttons.id = "click";
        this.setTitle(title);
        this.setHeading(heading);
        this.screen.appendChild(this.wrapper);
        this.screen.appendChild(this.buttons);
        document.body.appendChild(this.screen);
        this.screen.style.display = "none";
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

    isVisible(): boolean {
        return this.visible;
    }

    private setTitle(title: string) {
        let titleElement = document.createElement("H1");
        titleElement.appendChild(document.createTextNode(title));
        this.screen.appendChild(titleElement);
    }

    private setHeading(heading: string) {
        let headingElement = document.createElement("H2");
        headingElement.appendChild(document.createTextNode(heading));
        this.screen.appendChild(headingElement);
    }
}