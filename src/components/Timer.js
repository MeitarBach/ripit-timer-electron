import React, {useEffect, useState} from 'react';
import Stopwatch from "./Stopwatch";
import {useTimer, beep, success} from "../hooks/useTimer";
import TimerButton, { ButtonTypes } from "./common/TimerButton";

function Timer({ currentWorkoutConfig }) {
    const [preCountdownRunning, setPreCountdownRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
    const [currentSegmentNumber, setCurrentSegmentNumber] = useState(1);
    const [timeToCountSeconds, setTimeToCountSeconds] = useState(0);
    const [showDone, setShowDone] = useState(false);
    const timer = useTimer({ isPreCountdown: false, countDownSeconds: timeToCountSeconds, handleCountdownFinish: handleSegmentFinished });
    const decrementSegmentEnabled = currentSegmentNumber === 1;
    const incrementSegmentEnabled = currentSegmentNumber === currentWorkoutConfig?.segments?.length;

    function handleSegmentFinished() {
        incrementSegment();
        if (currentRoundNumber <= currentWorkoutConfig.rounds) {
            timer.startTimer();
        } else {
            timer.stopTimer();
            timer.resetTimer();
        }
    }

    const startPreCountdown = () => {
        setPreCountdownRunning(true);
    }

    const stopPreCountdown = () => {
        setPreCountdownRunning(false);
    }

    const resetTimer = () => {
        timer.stopTimer();
        timer.resetTimer();
        setTimeToCountSeconds(currentWorkoutConfig.segments ? currentWorkoutConfig.segments[0] : 0);
        setCurrentSegmentNumber(1);
        setCurrentRoundNumber(1);
    }

    const incrementSegment = () => {
        setCurrentSegmentNumber(currentSegmentNumber + 1);
    }

    const decrementSegment = () => {
        setCurrentSegmentNumber(currentSegmentNumber - 1);
    }

    const incrementRound = () => {
        setCurrentRoundNumber(currentRoundNumber + 1);
    }

    const pauseTimer = () => {
        timer.stopTimer();
        setIsPaused(true);
    }

    const resumeTimer = () => {
        timer.startTimer();
        setIsPaused(false);
    }

    const stopTimer = async () => {
        resetTimer();
        beep.stop();
        success.play('full', true);
        setShowDone(true);
        await waitThreeSeconds();
        setShowDone(false);
    }

    const waitThreeSeconds = () => new Promise(res => setTimeout(res, 3000));

    useEffect(() => {
        setTimeToCountSeconds(currentWorkoutConfig.segments ? currentWorkoutConfig.segments[0] : 0);
    }, [currentWorkoutConfig]);

    useEffect(() => {
        if (currentWorkoutConfig.segments && currentSegmentNumber > currentWorkoutConfig.segments.length) {
            incrementRound();
            setCurrentSegmentNumber(1);
        }
        setTimeToCountSeconds(currentWorkoutConfig.segments ? currentWorkoutConfig.segments[currentSegmentNumber - 1] : 0);
    }, [currentSegmentNumber, currentWorkoutConfig.segments]);

    useEffect(() => {
        if (currentRoundNumber > currentWorkoutConfig.rounds) {
            stopTimer();
        }
    }, [currentRoundNumber, currentWorkoutConfig.rounds]);


    return (
        <div className="timer">
            <div className="timer__header">
                <img src={require('../assests/images/secondary_logo.png')}/>
                <h1>{currentWorkoutConfig.title}</h1>
                <div className="timer__progress">
                    <h1>R {currentRoundNumber}/{currentWorkoutConfig.rounds}</h1>
                    <div className="timer__segments">
                        <TimerButton btnType={ButtonTypes.BACKWARD} onClick={decrementSegment} disabled={decrementSegmentEnabled}/>
                        <h1>S {currentSegmentNumber}/{currentWorkoutConfig.segments?.length}</h1>
                        <TimerButton btnType={ButtonTypes.FORWARD} onClick={incrementSegment} disabled={incrementSegmentEnabled}/>
                    </div>
                </div>
                {!timer.timerRunning ?
                    <TimerButton btnType={ButtonTypes.PLAY} onClick={isPaused ? resumeTimer : startPreCountdown}/> :
                    <>
                        <TimerButton btnType={ButtonTypes.PAUSE} onClick={pauseTimer}/>
                        <TimerButton btnType={ButtonTypes.STOP} onClick={stopTimer}/>
                    </>
                }
            </div>
            <div className="timer__body">
                <Stopwatch timeToCountSeconds={timeToCountSeconds}
                           preCountdownRunning={preCountdownRunning}
                           stopPreCountdown={stopPreCountdown}
                           timer={timer}
                           showDone={showDone}/>
            </div>
            {/*<img src={require('../assests/images/secondary_icon.png')}/>*/}
        </div>
    );
}

export default Timer;