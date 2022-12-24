import { useEffect, useState } from "react";
import Beep from '../assests/sounds/beeep.mp3';
import Success from '../assests/sounds/success.mp3';
import { Howl } from "howler";

const noop = () => {};

const beep = new Howl(({
    src: Beep,
    sprite: {
        full: [0, 4000],
        short: [1000, 4000],
        end: [3000, 4000],
    },
    preload: true
}));

const success = new Howl(({
    src: Success,
    sprite: {
        full: [0, 4000]
    },
    preload: true
}));

const useTimer = ({ isPreCountdown, countDownSeconds, handleCountdownFinish =  noop}) => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(countDownSeconds);

    const startTimer = () => {
        setTimerRunning(true);
    }

    const stopTimer = () => {
        setTimerRunning(false);
    }

    const resetTimer = () => {
        setRemainingSeconds(countDownSeconds);
    }

    if (timerRunning && isPreCountdown && remainingSeconds === 3) {
        beep.play('full', true);
    } else if (timerRunning && !isPreCountdown && remainingSeconds === 2) {
        beep.play('short', true);
    }

    useEffect(() => {
        let interval = null;
        if (timerRunning) {
            interval = setInterval(() => {
                setRemainingSeconds((prevRemainingSeconds) => prevRemainingSeconds - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerRunning]);

    useEffect(() => {
        setRemainingSeconds(countDownSeconds);
    }, [countDownSeconds]);

    useEffect(() => {
        if (remainingSeconds < 0) {
            stopTimer();
            resetTimer();
            handleCountdownFinish();
        }
    }, [remainingSeconds]);

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return {minutes, seconds, remainingSeconds, timerRunning, startTimer, stopTimer, resetTimer};
};

export { useTimer, beep, success };