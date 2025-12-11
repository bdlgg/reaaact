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
        if (apiTechnologies) {
            const now = new Date().toISOString();
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
            const newLocal = {
                ...prev, [techId]: {
                    ...prev[techId],
                    [field]: value,
                    updatedAt: new Date().toISOString(),
                },
            }
            return newLocal;
        })
    }

    const updateStatus = (techId, newStatus) => {
        updateLocalField(techId, 'status', newStatus);
    };

    const updateNotes = (techId, newNotes) => {
        updateLocalField(techId, 'notes', newNotes);
    };

    const updateDeadlineAndPriority = (techId, deadline, priority) => {
        setLocalData(prev => ({
            ...prev, [techId]: {
                ...prev[techId],
                deadline,
                priority,
                updatedAt: new Date().toISOString(),
            },
        }));
    };

    const markAllCompleted = () => {
        const newLocal = {...localData};
        technologies.forEach((tech) => {
            newLocal[tech.id] = {
                ...newLocal[tech.id],
                status: 'completed',
                updatedAt: new Date().toISOString(),
            };
        });
        setLocalData(newLocal);
    };

    const resetAll = () => {
        const newLocal = {};
        technologies.forEach(tech => {
            newLocal[tech.id] = {
                status: 'not-started',
                notes: '',
                deadline: '',
                priority: 'medium',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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
        techIds.forEach(id => {
            newLocal[id] = {
                ...newLocal[id],
                status: newStatus,
                updatedAt: new Date().toISOString(),
            }
        })
        setLocalData(newLocal);
    };

    return {
        technologies, loading, error, updateStatus, updateNotes, updateDeadlineAndPriority, markAllCompleted, resetAll, randomNext, bulkUpdateStatus, refetch, setTechnologies, setLocalData
    };
}

export default useTechnologies;