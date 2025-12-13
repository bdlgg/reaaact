import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, Chip, Paper, Grid, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import useTechnologies from "../hooks/useTechnologies.jsx";
import QuickActions from "../components/QuickActions.jsx";
import TechnologyCard from "../components/TechnologyCard.jsx";

function TechnologyList() {
    const {
        technologies,
        loading,
        error,
        refetch,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAll,
        randomNext,
        bulkUpdateStatus,
        syncTechnologiesFromLocalData
    } = useTechnologies();

    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const timeoutRef = useRef(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 400);
        return () => clearTimeout(timeoutRef.current);
    }, [searchQuery]);

    const wrappedUpdateStatus = (techId, newStatus) => {
        updateStatus(techId, newStatus);
        setRefreshKey(prev => prev + 1);
    };

    const wrappedUpdateNotes = (techId, newNotes) => {
        updateNotes(techId, newNotes);
        setRefreshKey(prev => prev + 1);
    };

    const wrappedMarkAllCompleted = () => {
        markAllCompleted();
        setTimeout(() => {
            setRefreshKey(prev => prev + 1);
        }, 100);
    };

    const wrappedResetAll = () => {
        resetAll();
        setTimeout(() => {
            setRefreshKey(prev => prev + 1);
        }, 100);
    };

    const wrappedRandomNext = () => {
        randomNext();
        setTimeout(() => {
            setRefreshKey(prev => prev + 1);
        }, 100);
    };

    const wrappedBulkUpdateStatus = (techIds, newStatus) => {
        bulkUpdateStatus(techIds, newStatus);
        setTimeout(() => {
            setRefreshKey(prev => prev + 1);
        }, 100);
    };

    const byStatus = technologies.filter(tech => {
        if (filter === 'all') return true;
        return tech.status === filter;
    });

    const filteredTechnologies = byStatus.filter(tech =>
        tech.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const forceRefreshData = () => {
        const savedData = localStorage.getItem('techTrackerUserData');
        if (savedData) {
            try {
                const localData = JSON.parse(savedData);
                syncTechnologiesFromLocalData(localData);
            } catch (err) {
                console.error("Ошибка синхронизации данных:", err);
            }
        }
        setRefreshKey(prev => prev + 1);
    };

    if (loading) {
        return (
            <Box sx={{
                p: 3,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px'
            }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6">Загрузка технологий...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Ошибка загрузки: {error}
                </Alert>
                <Button onClick={refetch} variant="contained" color="primary">
                    Попробовать снова
                </Button>
            </Box>
        );
    }

    return (
        <Box key={refreshKey} sx={{ p: 2, maxWidth: '1200px', mx: 'auto', width: '100%' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h4" component="h1">
                    Все технологии ({technologies.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                        onClick={forceRefreshData}
                        variant="outlined"
                        color="info"
                        startIcon={<RefreshIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Обновить
                    </Button>
                    <Button
                        component={Link}
                        to="/add-technology"
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Добавить технологию
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
                <TextField
                    fullWidth
                    label="Поиск технологий"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    placeholder="Введите название или описание..."
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                        label="Все"
                        onClick={() => setFilter('all')}
                        variant={filter === 'all' ? 'filled' : 'outlined'}
                        color={filter === 'all' ? 'primary' : 'default'}
                        clickable
                    />
                    <Chip
                        label="Не начато"
                        onClick={() => setFilter('not-started')}
                        variant={filter === 'not-started' ? 'filled' : 'outlined'}
                        color={filter === 'not-started' ? 'default' : 'default'}
                        clickable
                    />
                    <Chip
                        label="В процессе"
                        onClick={() => setFilter('in-progress')}
                        variant={filter === 'in-progress' ? 'filled' : 'outlined'}
                        color={filter === 'in-progress' ? 'warning' : 'default'}
                        clickable
                    />
                    <Chip
                        label="Завершено"
                        onClick={() => setFilter('completed')}
                        variant={filter === 'completed' ? 'filled' : 'outlined'}
                        color={filter === 'completed' ? 'success' : 'default'}
                        clickable
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1
                }}>
                    <Typography variant="body2" color="text.secondary">
                        Найдено: <strong>{filteredTechnologies.length}</strong> из {technologies.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Фильтр: {filter === 'all' ? 'Все' :
                        filter === 'not-started' ? 'Не начато' :
                            filter === 'in-progress' ? 'В процессе' : 'Завершено'}
                    </Typography>
                </Box>
            </Paper>

            <QuickActions
                technologies={technologies}
                onMarkAllCompleted={wrappedMarkAllCompleted}
                onResetAll={wrappedResetAll}
                onRandomNext={wrappedRandomNext}
                onBulkUpdate={wrappedBulkUpdateStatus}
            />

            {filteredTechnologies.length > 0 ? (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {filteredTechnologies.map(tech => (
                        <Grid item xs={12} sm={6} md={4} key={tech.id}>
                            <TechnologyCard
                                id={tech.id}
                                title={tech.title}
                                description={tech.description}
                                status={tech.status}
                                notes={tech.notes}
                                resources={tech.resources}
                                onStatusChange={(newStatus) => wrappedUpdateStatus(tech.id, newStatus)}
                                onNotesChange={(techId, newNotes) => wrappedUpdateNotes(techId, newNotes)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper sx={{
                    textAlign: 'center',
                    p: 6,
                    borderRadius: 2,
                    bgcolor: 'background.default'
                }}>
                    <Box sx={{ mb: 2 }}>
                        <SearchIcon sx={{ fontSize: 60, color: 'text.disabled', opacity: 0.5 }} />
                    </Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Технологии не найдены
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {searchQuery ? `По запросу "${searchQuery}" ничего не найдено` :
                            filter !== 'all' ? `Нет технологий со статусом "${filter}"` :
                                'В вашем списке пока нет технологий'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {searchQuery && (
                            <Button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilter('all');
                                }}
                                variant="outlined"
                                color="primary"
                            >
                                Очистить поиск
                            </Button>
                        )}
                        {filter !== 'all' && (
                            <Button
                                onClick={() => setFilter('all')}
                                variant="outlined"
                                color="primary"
                            >
                                Показать все технологии
                            </Button>
                        )}
                        <Button
                            component={Link}
                            to="/add-technology"
                            variant="contained"
                            color="primary"
                        >
                            Добавить первую технологию
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}

export default TechnologyList;