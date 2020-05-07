export default class GUI{
    protected gui = document.createElement("DIV");
    protected head = document.createElement("DIV");
    private collectedLights: number = 0;
    private light: number = 80;

    constructor() {
        this.gui.id = "gui";
        document.body.appendChild(this.gui);
        this.setupHead();
        this.setupCollectedLights();
        this.setupTime();
    }

    private setupHead(){
        this.head = document.createElement("DIV");
        this.head.id = "head";
        this.gui.appendChild(this.head);
    }

    private setupCollectedLights() {
        let lightCount = document.createElement("H2");
        lightCount.id = "lightCount";
        lightCount.innerHTML = this.collectedLights + " &#11044;";
        this.head.appendChild(lightCount);
    }

    private setupTime(){
        let time = document.createElement("H2");
        time.id = "time";
        time.innerHTML = '<svg width="100%" height="43">' +
            '  <rect x="0" y="0" width="100%" height="43" rx="5" ry="5"' +
            '  style="fill:white;border-radius:10px;opacity:0.5" />' +
            ' <rect x="0" y="0" width="' + this.light + '%" height="43" rx="5" ry="5"' +
            '  style="fill:white;border-radius:10px;" />' +
            '</svg>';
        this.head.appendChild(time);
        this.setupLeft();
    }

    private setupLeft(){
        let left = document.createElement("H2");
        left.id = "left";
        this.head.appendChild(left);
    }

    public updateCollectedLights(collectedLights: number){
        this.collectedLights = collectedLights
    }

    public updateTime(time: number){
        this.light = time;
    }
}