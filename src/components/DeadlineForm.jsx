import { useState } from 'react';
import { TextField, MenuItem, Button, Box, FormControl, InputLabel, Select } from '@mui/material';

function DeadlineForm({ onSave, onCancel, initialData }) {
    const [deadline, setDeadline] = useState(initialData?.deadline || '');
    const [priority, setPriority] = useState(initialData?.priority || 'medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ deadline, priority });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Дедлайн"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                    <InputLabel>Приоритет</InputLabel>
                    <Select
                        value={priority}
                        label="Приоритет"
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <MenuItem value="low">Низкий</MenuItem>
                        <MenuItem value="medium">Средний</MenuItem>
                        <MenuItem value="high">Высокий</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button type="button" onClick={onCancel} color="secondary">Отмена</Button>
                    <Button type="submit" variant="contained" color="primary">Сохранить</Button>
                </Box>
            </Box>
        </form>
    );
}

export default DeadlineForm;