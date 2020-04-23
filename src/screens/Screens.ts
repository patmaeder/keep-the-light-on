export class Screens {
    private screen = document.createElement("DIV");
    private buttons = document.createElement("DIV");
    private visible: boolean = false;
    constructor(title: string) {
        this.screen.id = "screen";
        this.buttons.id = "menu";
        this.setTitle(title);
        this.screen.appendChild(this.buttons);
        document.body.appendChild(this.screen);
    }
    private setTitle(title){
        let titleElement = document.createElement("H1");
        titleElement.appendChild(document.createTextNode(title));
        this.screen.appendChild(titleElement);
    }
    switchVisibleStatus(){
        if(this.visible){
            this.screen.style.display = "none";
            this.visible = false;
        } else {
            this.screen.style.display = "block";
            this.visible = true;
        }
    }
    addButton(text, id){
        let button = document.createElement("BUTTON");
        button.appendChild(document.createTextNode(text));
        button.id = id;
        this.buttons.appendChild(button);
    }
}