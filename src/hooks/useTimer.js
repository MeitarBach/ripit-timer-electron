import { useEffect, useState } from "react";
import Beep from '../sounds/beep.mp3';
import { Howl } from "howler";

const noop = () => {};

const useTimer = ({ countDownSeconds, handleCountdownFinish =  noop}) => {
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

    const beep = new Howl(({
        src: Beep,
        sprite: {
            short: [0, 200],
            long: [0, 1000]
        },
        preload: true
    }));

    if (timerRunning && remainingSeconds >= 1 && remainingSeconds <= 3) {
        beep.play('short');
    } else if (timerRunning && remainingSeconds === 0) {
        beep.play('long');
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

export { useTimer };