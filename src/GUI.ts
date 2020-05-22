export default class GUI {
    protected gui = document.createElement("DIV");
    protected head = document.createElement("DIV");
    private collectedLights: number = 0;
    private light: number = 100;
    private time;
    private lightCount;

    constructor() {
        this.gui.id = "gui";
        document.body.appendChild(this.gui);
        this.setupHead();
        this.setupCollectedLights();
        this.setupTime();
    }

    public updateCollectedLights(collectedLights: number) {
        this.collectedLights = collectedLights;
        //TODO Make it better for performance
        this.lightCount.innerHTML = this.collectedLights + " &#11044;";

    }

    public updateTime(time: number) {
        this.light = time;
        //TODO Make it better for performance
        this.time.innerHTML = '<svg width="100%" height="43">' +
            '  <rect x="0" y="0" width="100%" height="43" rx="5" ry="5"' +
            '  style="fill:white;border-radius:10px;opacity:0.5" />' +
            ' <rect x="0" y="0" width="' + this.light + '%" height="43" rx="5" ry="5"' +
            '  style="fill:white;border-radius:10px;" />' +
            '</svg>';
    }

    private setupHead() {
        this.head = document.createElement("DIV");
        this.head.id = "head";
        this.gui.appendChild(this.head);
    }

    private setupCollectedLights() {
        this.lightCount = document.createElement("H2");
        this.lightCount.id = "lightCount";
        this.lightCount.innerHTML = this.collectedLights + " &#11044;";
        this.head.appendChild(this.lightCount);
    }

    private setupTime() {
        this.time = document.createElement("H2");
        this.time.id = "time";
        this.time.innerHTML = '<svg width="100%" height="43">' +
            '  <rect x="0" y="0" width="100%" height="43" rx="5" ry="5"' +
            '  style="fill:white;border-radius:10px;opacity:0.5" />' +
            ' <rect x="0" y="0" width="' + this.light + '%" height="43" rx="5" ry="5"' +
            '  style="fill:white;border-radius:10px;" />' +
            '</svg>';
        this.head.appendChild(this.time);
        this.setupLeft();
    }

    private setupLeft() {
        let left = document.createElement("H2");
        left.id = "left";
        this.head.appendChild(left);
    }
}