import React, {useEffect, useState} from 'react';
import Stopwatch from "./Stopwatch";
import { useTimer } from "../hooks/useTimer";
import TimerButton, { ButtonTypes } from "./common/TimerButton";

function Timer({ currentWorkoutConfig }) {
    const [preCountdownRunning, setPreCountdownRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
    const [currentSegmentNumber, setCurrentSegmentNumber] = useState(1);
    const [timeToCountSeconds, setTimeToCountSeconds] = useState(0);
    const timer = useTimer({ countDownSeconds: timeToCountSeconds, handleCountdownFinish: handleSegmentFinished });
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

    const stopTimer = () => {
        resetTimer();
        timer.stopTimer();
        timer.resetTimer();
    }

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
            timer.stopTimer();
            resetTimer();
        }
    }, [currentRoundNumber, currentWorkoutConfig.rounds]);


    return (
        <div className="timer">
            <div className="timer__header">
                <h1>{currentWorkoutConfig.title}</h1>
                <div className="timer__progress">
                    <h2>R {currentRoundNumber}/{currentWorkoutConfig.rounds}</h2>
                    <div className="timer__segments">
                        <TimerButton btnType={ButtonTypes.BACKWARD} onClick={decrementSegment} disabled={decrementSegmentEnabled}/>
                        <h4>S {currentSegmentNumber}/{currentWorkoutConfig.segments?.length}</h4>
                        <TimerButton btnType={ButtonTypes.FORWARD} onClick={incrementSegment} disabled={incrementSegmentEnabled}/>
                    </div>
                </div>
                {!timer.timerRunning ?
                    <TimerButton btnType={ButtonTypes.PLAY} onClick={isPaused ? resumeTimer : startPreCountdown}/> :
                    // <button onClick={isPaused ? resumeTimer : startPreCountdown}>Play</button> :
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
                           timer={timer} />
            </div>
        </div>
    );
}

export default Timer;