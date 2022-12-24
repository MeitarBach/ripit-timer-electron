import React, {useState} from 'react';
import { TrainingConfigurationsApi } from "../data/TrainingConfiguration";
import TimerButton, { ButtonTypes } from "./common/TimerButton";

function Menu({ workoutConfigs, toggleAddWorkoutDialog, selectedId, selectWorkout }) {

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(prevShowMenu => !prevShowMenu);
    }

    return (
        <>
            <div className="menu" style={{flexGrow: showMenu ? 2 : 0}}>
                <TimerButton btnType={ButtonTypes.MENU} onClick={toggleMenu}/>
                <div className={`menu${showMenu ? "__visible" : "__hidden"}`}>
                    <TimerButton btnType={ButtonTypes.PLUS} onClick={() => toggleAddWorkoutDialog()}/>
                    {workoutConfigs.map((workoutConfig, index) => (
                        <WorkoutMenuItem key={`workout-${index}`} selectedId={selectedId} selectWorkout={selectWorkout}
                                         workoutConfig={workoutConfig} workoutConfigs={workoutConfigs}/>
                    ))}
                </div>
            </div>
        </>
    );
}

function WorkoutMenuItem({ workoutConfig, selectedId, selectWorkout, workoutConfigs }) {

    const deleteWorkout = () => {
        TrainingConfigurationsApi.deleteConfiguration(workoutConfig.id);
        if (workoutConfig.id === selectedId) {
            // If we deleted the current workout, select the first workout by default
            selectWorkout(workoutConfigs[0].id);
        } else {
            selectWorkout(selectedId);
        }
    }

    const handleDeleteClick = (workoutId) => {
        if (window.confirm("Are you sure you want to delete this workout?") === true) {
            deleteWorkout(workoutId);
        }
    }

    return (
        <div className="menu-item">
            <div className="menu-item__workout" onClick={() => selectWorkout(workoutConfig.id)}>
                <span>{workoutConfig.title}</span>
                {!workoutConfig.isDefault && <TimerButton btnType={ButtonTypes.DELETE} onClick={() => handleDeleteClick(workoutConfig.id)}>x</TimerButton>}
            </div>
        </div>
    );
}

export default Menu;