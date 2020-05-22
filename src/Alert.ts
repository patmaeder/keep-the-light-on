//###############################################################################Start: Laurin Dörre
export default class Alert {
    private popup = document.createElement("DIV");

    constructor(number: number, prefix: string, suffix: string) {
        this.popup.id = "popup";
        this.popup.appendChild(document.createTextNode(prefix + number + suffix));
        document.body.appendChild(this.popup);
        this.openPopup();
    }

    private async openPopup() {
        this.popup.style.display = "block";
        await this.timeout(3500);
        this.popup.style.display = "none";
    }

    private timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
//###############################################################################Ende: Laurin Dörre