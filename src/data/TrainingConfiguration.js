import { v4 as uuidv4 } from 'uuid';

export class TrainingConfiguration {
    constructor(title, rounds, segments, isDefault) {
        this.id = uuidv4();
        this.title = title;
        this.rounds = rounds;
        this.segments = segments;
        this.isDefault = isDefault;
    }
}

const DefaultConfigurations = [
    {
        id: uuidv4(),
        title: "Tabata",
        rounds: 100,
        segments: [20, 10],
        isDefault: true
    },
    {
        id: uuidv4(),
        title: "EMOM",
        rounds: 100,
        segments: [60],
        isDefault: true
    },
    {
        id: uuidv4(),
        title: "E2MOM",
        rounds: 100,
        segments: [120],
        isDefault: true
    },
    {
        id: uuidv4(),
        title: "30 Sec",
        rounds: 100,
        segments: [30],
        isDefault: true
    }
];

for (let i = 3 ; i <= 10 ; i++) {
    const config = new TrainingConfiguration(`${i} Min`, 100, [i * 60], true);
    DefaultConfigurations.push(config);
}

export class TrainingConfigurationsApi {
    static getConfigurations = () => {
        return new Promise((resolve, reject) => {
            try {
                let trainingConfigs = JSON.parse(localStorage.getItem('training_configs'));
                if (!trainingConfigs) {
                    trainingConfigs = DefaultConfigurations;
                    localStorage.setItem('training_configs', JSON.stringify(trainingConfigs));
                }
                resolve(trainingConfigs);
            } catch (err) {
                reject(err);
            }
        })
    }

    static saveConfiguration = (configuration) => {
        let trainingConfigs = JSON.parse(localStorage.getItem('training_configs'));
        trainingConfigs.push(configuration);
        localStorage.setItem('training_configs', JSON.stringify(trainingConfigs));
    }

    static deleteConfiguration = (configurationId) => {
        let trainingConfigs = JSON.parse(localStorage.getItem('training_configs'));
        trainingConfigs = trainingConfigs.filter(config => config.id !== configurationId);
        localStorage.setItem('training_configs', JSON.stringify(trainingConfigs));
    }

    static searchConfigurations = async (configurations, searchPhrase) => {
        return configurations.filter(configuration => configuration.title.includes(searchPhrase));
    }
}