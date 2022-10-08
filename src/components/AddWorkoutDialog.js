import React, {useState} from 'react';
import {TrainingConfiguration, TrainingConfigurationsApi} from "../data/TrainingConfiguration";
import TimerButton, { ButtonTypes } from "./common/TimerButton";

function AddWorkoutDialog({ showDialog, toggleShowDialog, setCurrentWorkoutConfig }) {
    const [title, setTitle] = useState('');
    const [rounds, setRounds] = useState(1);
    const [segments, setSegments] = useState([]);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleRoundsChange = (event) => {
        setRounds(event.target.value);
    }

    const handleSegmentChange = (index, event) => {
        let newSegments = [...segments];
        newSegments[index] = parseInt(event.target.value);
        setSegments(newSegments);
    }

    const addSegment = () => {
        let newSegments = [...segments];
        newSegments.push(0);
        setSegments(newSegments);
    }

    const deleteSegment = (segmentIndex) => {
        let newSegments =[...segments];
        newSegments.splice(segmentIndex, 1);
        setSegments(newSegments);
    }

    const handleSubmit = () => {
        const errorMessage = validateInputs();
        if (errorMessage) {
            alert(errorMessage);
            return;
        }
        const workoutConfig = new TrainingConfiguration(title, rounds, segments, false);
        TrainingConfigurationsApi.saveConfiguration(workoutConfig);
        toggleShowDialog();
        resetInput();
        setCurrentWorkoutConfig(workoutConfig);
    }

    function resetInput() {
        setTitle('');
        setRounds(1);
        setSegments([]);
    }

    function validateInputs() {
        if (title.length === 0)
            return 'Workout title is empty ;(';
        if (rounds <= 0)
            return 'Workout should have at least 1 round';
        if (segments.length === 0)
            return 'Workout should have at least 1 segment';
        const negativeTimeSegment = segments.some(segment => segment < 0);
        if (negativeTimeSegment)
            return 'One of the segments you entered is shorter then 0 seconds... what??';

        return '';
    }

    return (
        <dialog open={showDialog} className="add-workout-dialog">
            <div className="add-workout-dialog__header">
                <TimerButton btnType={ButtonTypes.CLOSE} onClick={() => toggleShowDialog()}/>
                <h2>Create a custom Workout</h2>
            </div>
            <div className="add-workout-dialog__form">
                <FormInput fieldName="title" labelValue="Title" type="text" value={title} onChange={handleTitleChange}/>
                <FormInput fieldName="rounds" labelValue="Rounds" type="number" value={rounds} onChange={handleRoundsChange}/>
                <div className="add-workout-dialog__form__segments">
                    {segments.map((segment, index) => (
                        <FormInput key={`segment-${index}`} fieldName={`segment-${index}`} labelValue={`Segment #${index + 1} `}
                                   type="number" value={segments[index]} onChange={e => handleSegmentChange(index, e)}
                                   deleteInput={() => deleteSegment(index)} />
                    ))}
                    <TimerButton btnType={ButtonTypes.PLUS} onClick={addSegment}/>
                </div>
            </div>
            <div className="add-workout-dialog__footer">
                <TimerButton btnType={ButtonTypes.SAVE} onClick={handleSubmit}/>
            </div>
        </dialog>
    );
}

function FormInput({fieldName, labelValue, type, value, onChange, deleteInput}) {
    return (
        <div className="form-input">
            <label htmlFor={fieldName}>{labelValue}</label>
            {type === 'textarea'
                ? <textarea name={fieldName} value={value} onChange={onChange}/>
                : <input type={type} value={value} name={fieldName} onChange={onChange}/>}
            {deleteInput && <TimerButton btnType={ButtonTypes.DELETE} onClick={deleteInput}/>}
        </div>
    )
}

export default AddWorkoutDialog;