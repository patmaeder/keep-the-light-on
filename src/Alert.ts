export default class Alert{
    private popup = document.createElement("DIV");

    constructor(timeLeft: number) {
        this.popup.id = "popup";
        this.popup.appendChild(document.createTextNode("You have " + timeLeft + " seconds left"));
        document.body.appendChild(this.popup);
        this.openPopup();
    }
    private async openPopup(){
        this.popup.style.display = "block";
        await this.timeout(3500);
        this.popup.style.display = "none";
    }
    private timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}