import React, { useEffect } from 'react';
import {useTimer} from "../hooks/useTimer";

function PreCountdownDialog({ preCountdownRunning, startTimer, stopPreCountdown }) {
    const preCountdownTimer = useTimer({countDownSeconds : 3, handleCountdownFinish: handlePreCountdownFinished});

    useEffect(() => {
        if (preCountdownRunning) {
            preCountdownTimer.startTimer();
        }
    }, [preCountdownRunning]);

    function handlePreCountdownFinished() {
        preCountdownTimer.stopTimer();
        preCountdownTimer.resetTimer();
        stopPreCountdown();
        startTimer();
    }

    return (
        <dialog className="pre-countdown-dialog" open={preCountdownTimer.timerRunning}>
            <span>{preCountdownTimer.seconds}</span>
        </dialog>
    );
}

export default PreCountdownDialog;