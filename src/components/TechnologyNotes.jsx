import { TextField } from '@mui/material';

function TechnologyNotes({ notes, onNotesChange, techId }) {
    return (
        <div className="notes-section">
            <TextField
                label="Мои заметки"
                value={notes || ''}
                onChange={(e) => onNotesChange(techId, e.target.value)}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
            />
            <div className="notes-hint">
                {notes && notes.length > 0 ? `заметка сохранена (${notes.length} символов)` : 'Добавьте заметку'}
            </div>
        </div>
    );
}

export default TechnologyNotes;