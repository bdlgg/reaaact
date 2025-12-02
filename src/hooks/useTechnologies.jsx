import useLocalStorage from './useLocalStorage';
import { useState } from "react";

const initialTechnologies = [
    {id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed', notes: '', deadline: '', priority: 'medium', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
    {id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'completed', notes: '', deadline: '', priority: 'medium', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
    {id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'in-progress', notes: '', deadline: '', priority: 'low', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
    {id: 4, title: 'Postgres', description: 'Изучение работы с запросами в postgres', status: 'in-progress', notes: '', deadline: '2025-12-31', priority: 'high', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()},
    {id: 5, title: 'useEffect', description: 'Работа с хуком useState', status: 'not-started', notes: '', deadline: '', priority: 'medium', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()}
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('techTrackerData', initialTechnologies);

    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech => {
                if (tech.id === techId) {
                    return { ...tech, status: newStatus, updatedAt: new Date().toISOString() };
                }
                return tech;
            })
        );
    };

    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev => prev.map(tech =>
            tech.id === techId ? { ...tech, notes: newNotes, updatedAt: new Date().toISOString() } : tech
        ));
    };

    const updateDeadlineAndPriority = (techId, newDeadline, newPriority) => {
        setTechnologies(prev => prev.map(tech =>
            tech.id === techId ? {...tech, deadline: newDeadline, priority: newPriority, updatedAt: new Date().toISOString() } : tech
        ));
    };

    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'completed', updatedAt: new Date().toISOString() }))
        );
    };

    const resetAll = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'not-started', notes: '', deadline: '', priority: 'medium', updatedAt: new Date().toISOString() }))
        );
    };

    const randomNext = () => {
        const notStarted = technologies.filter(t => t.status === 'not-started');
        if (notStarted.length === 0) return;
        const random = notStarted[Math.floor(Math.random() * notStarted.length)];
        updateStatus(random.id, 'in-progress');
    };

    const bulkUpdateStatus = (techIds, newStatus) => {
        setTechnologies(prev => prev.map(tech => {
            if (techIds.includes(tech.id)) {
                return { ...tech, status: newStatus, updatedAt: new Date().toISOString() };
            }
            return tech;
        }));
    };

    return {
        technologies, setTechnologies, updateStatus, updateNotes, updateDeadlineAndPriority, markAllCompleted, resetAll, randomNext, bulkUpdateStatus
    };
}

export default useTechnologies;