import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Chip, Alert, Link as MuiLink, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import useTechnologies from '../hooks/useTechnologies';
import Modal from '../components/Modal';
import DeadlineForm from "../components/DeadlineForm.jsx";

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { technologies, updateStatus, updateNotes, updateDeadlineAndPriority } = useTechnologies();
    const technology = technologies.find(t => t.id === parseInt(techId));

    const [localNotes, setLocalNotes] = useState(technology?.notes || '');
    const [showDeadlineModal, setShowDeadlineModal] = useState(false);

    useEffect(() => {
        if (technology) {
            setLocalNotes(technology.notes);
        }
    }, [technology]);

    const handleStatusChange = (newStatus) => {
        if (technology) {
            updateStatus(technology.id, newStatus);
        }
    };

    const handleNotesChange = (e) => {
        const value = e.target.value;
        setLocalNotes(value);
        if (technology) {
            updateNotes(technology.id, value);
        }
    };

    const handleDeadlineSave = (deadlineData) => {
        if (technology) {
            updateDeadlineAndPriority(technology.id, deadlineData.deadline, deadlineData.priority);
        }
        setShowDeadlineModal(false);
    };

    const handleDeadlineCancel = () => {
        setShowDeadlineModal(false);
    };

    if (!technology) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="error">Технология не найдена</Alert>
                <Button
                    component={Link}
                    to="/technologies"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mt: 2 }}
                >
                    Назад к списку
                </Button>
            </Box>
        );
    }

    const formattedDeadline = technology.deadline
        ? new Date(technology.deadline).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'Не установлен';

    return (
        <Box sx={{ p: 2, maxWidth: 800, mx: 'auto', width: '100%' }}>
            <Button
                component={Link}
                to="/technologies"
                startIcon={<ArrowBackIcon />}
                color="secondary"
                sx={{ mb: 2 }}
            >
                Назад к списку
            </Button>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {technology.title}
                </Typography>

                <Typography variant="body1" gutterBottom>
                    <strong>Описание:</strong> {technology.description}
                </Typography>

                {technology.resources && technology.resources.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Полезные ресурсы</Typography>
                        <Box>
                            {technology.resources.map((url, idx) => (
                                <MuiLink
                                    key={idx}
                                    href={url.trim()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="primary"
                                    underline="hover"
                                    display="block"
                                    sx={{ mb: 0.5 }}
                                >
                                    {url.trim()}
                                </MuiLink>
                            ))}
                        </Box>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Статус изучения</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            <Chip
                                label="Не начато"
                                clickable
                                color={technology.status === 'not-started' ? 'default' : 'secondary'}
                                variant={technology.status === 'not-started' ? 'filled' : 'outlined'}
                                onClick={() => handleStatusChange('not-started')}
                            />
                            <Chip
                                label="В процессе"
                                clickable
                                color={technology.status === 'in-progress' ? 'warning' : 'secondary'}
                                variant={technology.status === 'in-progress' ? 'filled' : 'outlined'}
                                onClick={() => handleStatusChange('in-progress')}
                            />
                            <Chip
                                label="Завершено"
                                clickable
                                color={technology.status === 'completed' ? 'success' : 'secondary'}
                                variant={technology.status === 'completed' ? 'filled' : 'outlined'}
                                onClick={() => handleStatusChange('completed')}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Сроки и приоритет</Typography>
                        <Typography><strong>Дедлайн:</strong> {formattedDeadline}</Typography>
                        <Typography><strong>Приоритет:</strong> {technology.priority}</Typography>
                        <Button
                            startIcon={<EditIcon />}
                            onClick={() => setShowDeadlineModal(true)}
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            Установить/Изменить
                        </Button>
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>Мои заметки</Typography>
                <textarea
                    value={localNotes}
                    onChange={handleNotesChange}
                    placeholder="Записывайте сюда свои важные моменты..."
                    rows="5"
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {localNotes.length > 0 ? `заметка сохранена (${localNotes.length} символов)` : 'Добавьте заметку'}
                </Typography>
            </Paper>

            <Modal
                isOpen={showDeadlineModal}
                onClose={handleDeadlineCancel}
                title="Установить срок и приоритет"
            >
                <DeadlineForm
                    onSave={handleDeadlineSave}
                    onCancel={handleDeadlineCancel}
                    initialData={{
                        deadline: technology.deadline,
                        priority: technology.priority
                    }}
                />
            </Modal>
        </Box>
    );
}

export default TechnologyDetail;