export default class Timer {

    private remainingTime: number;
    private countdown;
        

    start(InitialValue: number) {
        this.remainingTime = InitialValue;

        this.countdown = setInterval(() => {
            this.remainingTime = this.remainingTime - 1;
            if(this.remainingTime === 0) {
                clearInterval(this.countdown);
                //Spiel beenden (PlayerMovement anhalten) + Ausgabe LostScreen 
            }
        },1000);
    }

    increase(IncreaseValue: number) {
        this.remainingTime = this.remainingTime + IncreaseValue;
    }

    pause() {
        clearInterval(this.countdown);
    }

    resume() {
        this.start(this.remainingTime);
    }
}