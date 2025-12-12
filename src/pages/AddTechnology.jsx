import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

function AddTechnology() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('frontend');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError('Поля "Название" и "Описание" обязательны для заполнения.');
            return;
        }
        alert('Технологии не добавляются в API. Перейдите в "Все технологии", чтобы увидеть список.');
        navigate('/technologies');
    };

    return (
        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Добавить новую технологию
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Название"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        autoFocus
                    />
                    <TextField
                        label="Описание"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        required
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Категория</InputLabel>
                        <Select
                            value={category}
                            label="Категория"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="frontend">Frontend</MenuItem>
                            <MenuItem value="backend">Backend</MenuItem>
                            <MenuItem value="database">Database</MenuItem>
                            <MenuItem value="devops">DevOps</MenuItem>
                            <MenuItem value="other">Другое</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/technologies')}
                            color="secondary"
                        >
                            Назад
                        </Button>
                        <Button
                            startIcon={<SaveIcon />}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Сохранить
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default AddTechnology;