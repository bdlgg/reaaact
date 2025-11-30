import useLocalStorage from "./useLocalStorage.jsx";
import {useState} from "react";

const initialTechnologies = [
    {id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed', notes: ''},
    {id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'completed', notes: ''},
    {id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'in-progress', notes: ''},
    {id: 4, title: 'Postgres', description: 'Изучение работы с запросами в postgres', status: 'in-progress', notes: ''},
    {id: 5, title: 'useEffect', description: 'Работа с хуком useState', status: 'not-started', notes: ''}
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('techTrackerData', initialTechnologies);
    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech => (tech.id === techId ? {...tech, status: newStatus} : tech)));
    };
    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev => prev.map(tech =>
        tech.id === techId ? {...tech, notes: newNotes} : tech));
    };
    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({...tech, status: 'completed'}))
        );
    };
    const resetAll = () => {
        setTechnologies(prev =>
            prev.map(tech => ({...tech, status: 'not-started'}))
        );
    };
    const randomNext = () => {
        const notStarted = technologies.filter(t => t.status === 'not-started');
        if (notStarted.length === 0) return;
        const random = notStarted[Math.floor(Math.random() * notStarted.length)];
        updateStatus(random.id, 'in-progress');
    };
    return {
        technologies, updateStatus, updateNotes, markAllCompleted, resetAll, randomNext
    };
}
export default useTechnologies;