import useLocalStorage from './useLocalStorage';
import {useEffect, useState} from "react";
import useApi from "./useApi.jsx";

function useTechnologies() {
    const {data: apiTechnologies, loading: apiLoading, error: apiError, refetch} = useApi('/reaaact/technologies.json')
    const [localData, setLocalData] = useLocalStorage('techTrackerUserData', {});
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для синхронизации данных из localStorage с состоянием
    const syncTechnologiesFromLocalData = (localData) => {
        const now = new Date().toISOString();
        const userTechs = [];

        for (const [id, data] of Object.entries(localData)) {
            if (data && data.title) {
                userTechs.push({
                    id: parseInt(id),
                    title: data.title,
                    description: data.description || '',
                    category: data.category || 'other',
                    resources: data.resources || [],
                    status: data.status || 'not-started',
                    notes: data.notes || '',
                    deadline: data.deadline || '',
                    priority: data.priority || 'medium',
                    createdAt: data.createdAt || now,
                    updatedAt: data.updatedAt || now,
                });
            }
        }

        // Если есть пользовательские технологии, используем их
        if (userTechs.length > 0) {
            setTechnologies(userTechs);
            return true;
        }

        // Иначе используем API данные
        if (apiTechnologies) {
            const merged = apiTechnologies.map(apiTech => {
                const local = localData[apiTech.id] || {};
                return {
                    id: apiTech.id,
                    title: apiTech.title,
                    description: apiTech.description,
                    category: apiTech.category,
                    resources: apiTech.resources || [],
                    status: local.status || 'not-started',
                    notes: local.notes || '',
                    deadline: local.deadline || '',
                    priority: local.priority || 'medium',
                    createdAt: local.createdAt || now,
                    updatedAt: local.updatedAt || now,
                }
            });
            setTechnologies(merged);
            return true;
        }

        return false;
    };

    useEffect(() => {
        if (apiLoading) {
            setLoading(true);
            return;
        }

        if (apiError) {
            setError(apiError);
            setLoading(false);
            return;
        }

        const success = syncTechnologiesFromLocalData(localData);
        if (success) {
            setError(null);
        }
        setLoading(false);
    }, [apiTechnologies, apiError, apiLoading, localData]);

    const updateLocalField = (techId, field, value) => {
        setLocalData(prev => {
            const current = prev[techId] || {};
            const newData = {
                ...prev,
                [techId]: {
                    ...current,
                    [field]: value,
                    updatedAt: new Date().toISOString(),
                    createdAt: current.createdAt || new Date().toISOString(),
                },
            };

            // Сразу синхронизируем состояние
            setTimeout(() => syncTechnologiesFromLocalData(newData), 0);

            return newData;
        });
    };

    const updateStatus = (techId, newStatus) => {
        updateLocalField(techId, 'status', newStatus);
    };

    const updateNotes = (techId, newNotes) => {
        updateLocalField(techId, 'notes', newNotes);
    };

    const updateDeadlineAndPriority = (techId, deadline, priority) => {
        setLocalData(prev => {
            const current = prev[techId] || {};
            const newData = {
                ...prev,
                [techId]: {
                    ...current,
                    deadline,
                    priority,
                    updatedAt: new Date().toISOString(),
                    createdAt: current.createdAt || new Date().toISOString(),
                },
            };

            // Сразу синхронизируем состояние
            setTimeout(() => syncTechnologiesFromLocalData(newData), 0);

            return newData;
        });
    };

    const markAllCompleted = () => {
        setLocalData(prev => {
            const newLocal = {...prev};
            const now = new Date().toISOString();

            technologies.forEach((tech) => {
                const current = newLocal[tech.id] || {};
                newLocal[tech.id] = {
                    ...current,
                    status: 'completed',
                    updatedAt: now,
                    createdAt: current.createdAt || now,
                };
            });

            // Сразу синхронизируем состояние
            setTimeout(() => syncTechnologiesFromLocalData(newLocal), 0);

            return newLocal;
        });
    };

    const resetAll = () => {
        setLocalData(prev => {
            const newLocal = {};
            const now = new Date().toISOString();

            technologies.forEach(tech => {
                newLocal[tech.id] = {
                    title: tech.title,
                    description: tech.description,
                    category: tech.category,
                    resources: tech.resources || [],
                    status: 'not-started',
                    notes: '',
                    deadline: '',
                    priority: 'medium',
                    createdAt: tech.createdAt || now,
                    updatedAt: now,
                };
            });

            // Сразу синхронизируем состояние
            setTimeout(() => syncTechnologiesFromLocalData(newLocal), 0);

            return newLocal;
        });
    };

    const randomNext = () => {
        const notStarted = technologies.filter(t => t.status === 'not-started');
        if (notStarted.length === 0) return;
        const random = notStarted[Math.floor(Math.random() * notStarted.length)];
        updateStatus(random.id, 'in-progress');
    };

    const bulkUpdateStatus = (techIds, newStatus) => {
        setLocalData(prev => {
            const newLocal = {...prev};
            const now = new Date().toISOString();

            techIds.forEach(id => {
                const current = newLocal[id] || {};
                newLocal[id] = {
                    ...current,
                    status: newStatus,
                    updatedAt: now,
                    createdAt: current.createdAt || now,
                };
            });

            // Сразу синхронизируем состояние
            setTimeout(() => syncTechnologiesFromLocalData(newLocal), 0);

            return newLocal;
        });
    };

    return {
        technologies,
        loading,
        error,
        updateStatus,
        updateNotes,
        updateDeadlineAndPriority,
        markAllCompleted,
        resetAll,
        randomNext,
        bulkUpdateStatus,
        refetch,
        setTechnologies,
        setLocalData,
        syncTechnologiesFromLocalData // экспортируем для ручной синхронизации
    };
}

export default useTechnologies;