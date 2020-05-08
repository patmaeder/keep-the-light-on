export class Screens {
  protected screen = document.createElement("DIV");
  private buttons = document.createElement("DIV");
  protected visible: boolean = false;

  constructor(title: string, imgUrl?: string) {
    this.screen.id = "screen";
    this.buttons.id = "menu";
    if(imgUrl){
      this.setImage(imgUrl);
    }
    this.setTitle(title);
    this.screen.appendChild(this.buttons);
    document.body.appendChild(this.screen);
  }

  private setImage(imgUrl){
    let image = document.createElement("IMG");
    image.setAttribute("src", imgUrl);
    this.screen.appendChild(image);
  }

  private setTitle(title) {
    let titleElement = document.createElement("H1");
    titleElement.appendChild(document.createTextNode(title));
    this.screen.appendChild(titleElement);
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
}
