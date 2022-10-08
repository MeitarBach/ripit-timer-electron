import React, { useEffect, useState } from 'react';
import Menu from "./Menu";
import Timer from "./Timer";
import { TrainingConfigurationsApi } from "../data/TrainingConfiguration";
import AddWorkoutDialog from "./AddWorkoutDialog";

function PageContainer({}) {
    const [workoutConfigs, setWorkoutConfigs] = useState([]);
    const [currentWorkoutConfig, setCurrentWorkoutConfig] = useState({});
    const [showAddWorkoutDialog, setShowAddWorkoutDialog] = useState(false);

    const toggleAddWorkoutDialog = () => {
        setShowAddWorkoutDialog(preShowWorkoutDialog => !preShowWorkoutDialog);
    }

    const selectWorkout = (workoutId) => {
        const selectedConfig = workoutConfigs.find(config => config.id === workoutId);
        if (selectedConfig) {
            setCurrentWorkoutConfig(selectedConfig);
        } else {
            setCurrentWorkoutConfig(workoutConfigs[0]);
        }
    }

    useEffect(() => {
        TrainingConfigurationsApi.getConfigurations().then(data => {
            setWorkoutConfigs(data);
            if (!currentWorkoutConfig.title) {
                setCurrentWorkoutConfig(data[0]);
            }
        });
    }, [currentWorkoutConfig]);

    return (
        <div className="container">
            <Menu workoutConfigs={workoutConfigs}
                  selectedId={currentWorkoutConfig.id}
                  selectWorkout={selectWorkout}
                  toggleAddWorkoutDialog={toggleAddWorkoutDialog} />
            <Timer currentWorkoutConfig={currentWorkoutConfig} />
            <AddWorkoutDialog showDialog={showAddWorkoutDialog}
                              toggleShowDialog={toggleAddWorkoutDialog}
                              setCurrentWorkoutConfig={setCurrentWorkoutConfig}/>
        </div>
    );
}

export default PageContainer;