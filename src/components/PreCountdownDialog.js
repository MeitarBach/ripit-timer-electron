import React, { useEffect } from 'react';
import {useTimer} from "../hooks/useTimer";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";

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

    const textToDisplay = preCountdownTimer.seconds > 0 ? preCountdownTimer.seconds : 'GO!';

    return (
        // <dialog className="pre-countdown-dialog" open={preCountdownTimer.timerRunning}>
        //     <span>{preCountdownTimer.seconds}</span>
        // </dialog>
        <CircularProgressbar
            text={textToDisplay}
            strokeWidth={5}
            styles={
                buildStyles(
                    {
                        textSize: '40px',
                        textColor: '#ff0000',
                        pathColor: '#ff0000',
                        trailColor: '#607EA3'
                    })
            }
        />
    );
}

export default PreCountdownDialog;