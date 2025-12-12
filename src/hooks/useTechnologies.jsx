import useLocalStorage from './useLocalStorage';
import {useEffect, useState} from "react";
import useApi from "./useApi.jsx";

function useTechnologies() {
    const {data: apiTechnologies, loading: apiLoading, error: apiError, refetch} = useApi('/reaaact/technologies.json')
    const [localData, setLocalData] = useLocalStorage('techTrackerUserData', {});
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        if (userTechs.length > 0) {
            setTechnologies(userTechs);
            setError(null);
            setLoading(false);
            return;
        }
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
            })
            setTechnologies(merged);
            setError(null);
        }

        setLoading(false);
    }, [apiTechnologies, apiError, apiLoading, localData])

    const updateLocalField = (techId, field, value) => {
        setLocalData(prev => {
            const current = prev[techId] || {};
            return {
                ...prev,
                [techId]: {
                    ...current,
                    [field]: value,
                    updatedAt: new Date().toISOString(),
                    createdAt: current.createdAt || new Date().toISOString(),
                },
            }
        })
    }

    const updateStatus = (techId, newStatus) => {
        updateLocalField(techId, 'status', newStatus);
    };

    const updateNotes = (techId, newNotes) => {
        updateLocalField(techId, 'notes', newNotes);
    };

    const updateDeadlineAndPriority = (techId, deadline, priority) => {
        setLocalData(prev => {
            const current = prev[techId] || {};
            return {
                ...prev,
                [techId]: {
                    ...current,
                    deadline,
                    priority,
                    updatedAt: new Date().toISOString(),
                    createdAt: current.createdAt || new Date().toISOString(),
                },
            }
        });
    };

    const markAllCompleted = () => {
        const newLocal = {...localData};
        technologies.forEach((tech) => {
            const current = newLocal[tech.id] || {};
            newLocal[tech.id] = {
                ...current,
                status: 'completed',
                updatedAt: new Date().toISOString(),
                createdAt: current.createdAt || new Date().toISOString(),
            };
        });
        setLocalData(newLocal);
    };

    const resetAll = () => {
        const newLocal = {};
        const now = new Date().toISOString();
        technologies.forEach(tech => {
            newLocal[tech.id] = {
                status: 'not-started',
                notes: '',
                deadline: '',
                priority: 'medium',
                createdAt: tech.createdAt || now,
                updatedAt: now,
            }
        })
        setLocalData(newLocal);
    };

    const randomNext = () => {
        const notStarted = technologies.filter(t => t.status === 'not-started');
        if (notStarted.length === 0) return;
        const random = notStarted[Math.floor(Math.random() * notStarted.length)];
        updateStatus(random.id, 'in-progress');
    };

    const bulkUpdateStatus = (techIds, newStatus) => {
        const newLocal = {...localData};
        const now = new Date().toISOString();
        techIds.forEach(id => {
            const current = newLocal[id] || {};
            newLocal[id] = {
                ...current,
                status: newStatus,
                updatedAt: now,
                createdAt: current.createdAt || now,
            }
        })
        setLocalData(newLocal);
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
        setLocalData
    };
}

export default useTechnologies;