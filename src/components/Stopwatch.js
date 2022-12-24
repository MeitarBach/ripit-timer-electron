import React from 'react';
import PreCountdownDialog from "./PreCountdownDialog";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Stopwatch({ timeToCountSeconds, timer, preCountdownRunning, stopPreCountdown, showDone }) {
    const originalMinutes = Math.floor(timeToCountSeconds / 60);
    const originalSeconds = timeToCountSeconds % 60;

    let showMinutes = timer.minutes < 10 ? `0${ timer.minutes < 0 ? originalMinutes : timer.minutes}` : timer.minutes;
    let showSeconds = timer.seconds < 10 ? `0${ timer.seconds < 0 ? originalSeconds : timer.seconds}` : timer.seconds;

    showMinutes = isNaN(showMinutes) ? 0 : showMinutes;
    showSeconds = isNaN(showSeconds) ? 0 : showSeconds;

    const percentage = timer.remainingSeconds / timeToCountSeconds * 100;

    return (
        <div className="stopwatch">
            { preCountdownRunning && <PreCountdownDialog preCountdownRunning={preCountdownRunning} startTimer={timer.startTimer} stopPreCountdown={stopPreCountdown}/>}
            { !preCountdownRunning && !showDone &&
                <CircularProgressbar
                    value={percentage}
                    text={`${showMinutes}:${showSeconds}`}
                    strokeWidth={4}
                    styles={
                        buildStyles(
                        {
                            textSize: '32px',
                            textColor: '#D8C183',
                            pathColor: '#D8C183',
                            trailColor: '#E5E3D7'
                        })
                    }/>
            }
            { !preCountdownRunning && showDone &&
                <CircularProgressbar
                    value={100}
                    text={"Done!"}
                    strokeWidth={5}
                    styles={
                        buildStyles(
                            {
                                textSize: '30px',
                                textColor: '#11ff00',
                                pathColor: '#11ff00',
                                trailColor: '#607EA3'
                            })
                    }/>
            }
        </div>
    );
}

export default Stopwatch;