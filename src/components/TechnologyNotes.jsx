function TechnologyNotes({notes, onNotesChange, techId}) {
    return (
        <div className="notes-section">
            <h4>Мои заметки:</h4>
            <textarea
                value={notes}
                onChange={(e) => onNotesChange(techId, e.target.value)}
                placeholder="Записывайте сюда свои важные моменты..."
                rows="3"/>
            <div className="notes-hint">
                {notes.length > 0 ? `заметка сохранена (${notes.length} символов)` : 'Добавьте заметку'}
            </div>
        </div>
    );
}

export default TechnologyNotes;