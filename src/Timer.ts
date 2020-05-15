import {LostScreen} from "./screens/LostScreen";
import {lightCounter} from "./index";

export default class Timer {

    private remainingTime: number;
    private countdown;
    private startTime;

    get Time() {
        return this.remainingTime;
    }

    get timeLeft() {
        // https://gist.github.com/Erichain/6d2c2bf16fe01edfcffa
        let endTime = new Date
        let divInMs = endTime.getTime() - this.startTime.getTime();
        let day, hour, minute, seconds;
        seconds = Math.floor(divInMs / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return {
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds
        }
    }

    start(InitialValue: number) {
        this.remainingTime = InitialValue;
        this.startTime = new Date;
        this.countdown = setInterval(() => {
            this.remainingTime = this.remainingTime - 1;
            if (this.remainingTime === 0) {
                clearInterval(this.countdown);
                new LostScreen(this.timeLeft.hour + " hours " + this.timeLeft.minute + " minutes " + this.timeLeft.seconds + " seconds ", lightCounter, 0).switchVisibleStatus();
                //Spiel beenden (PlayerMovement anhalten) + Ausgabe LostScreen
            }
        }, 1000);
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