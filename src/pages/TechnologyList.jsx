import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, Chip, Paper, Grid, InputAdornment, Alert } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import useTechnologies from "../hooks/useTechnologies.jsx";
import QuickActions from "../components/QuickActions.jsx";
import TechnologyCard from "../components/TechnologyCard.jsx";

function TechnologyList() {
    const { technologies, loading, error, refetch, updateStatus, updateNotes } = useTechnologies();
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 400);
        return () => clearTimeout(timeoutRef.current);
    }, [searchQuery]);

    const byStatus = technologies.filter(tech => {
        if (filter === 'all') return true;
        return tech.status === filter;
    });
    const filteredTechnologies = byStatus.filter(tech =>
        tech.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
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
                <Button onClick={refetch} variant="contained" color="primary">Попробовать снова</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" component="h1">Все технологии</Typography>
                <Button
                    component={Link}
                    to="/add-technology"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Добавить технологию
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
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
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                        label="Все"
                        onClick={() => setFilter('all')}
                        variant={filter === 'all' ? 'filled' : 'outlined'}
                        color="default"
                        clickable
                    />
                    <Chip
                        label="Не начато"
                        onClick={() => setFilter('not-started')}
                        variant={filter === 'not-started' ? 'filled' : 'outlined'}
                        color="default"
                        clickable
                    />
                    <Chip
                        label="В процессе"
                        onClick={() => setFilter('in-progress')}
                        variant={filter === 'in-progress' ? 'filled' : 'outlined'}
                        color="warning"
                        clickable
                    />
                    <Chip
                        label="Завершено"
                        onClick={() => setFilter('completed')}
                        variant={filter === 'completed' ? 'filled' : 'outlined'}
                        color="success"
                        clickable
                    />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Найдено: {filteredTechnologies.length}
                </Typography>
            </Paper>

            <QuickActions technologies={technologies} />

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
                            onStatusChange={(newStatus) => updateStatus(tech.id, newStatus)}
                            onNotesChange={(techId, newNotes) => updateNotes(techId, newNotes)}

                        />
                    </Grid>
                ))}
            </Grid>

            {filteredTechnologies.length === 0 && (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h6" color="text.secondary">Технологий не найдено</Typography>
                    <Button
                        component={Link}
                        to="/add-technology"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Добавить первую технологию
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default TechnologyList;