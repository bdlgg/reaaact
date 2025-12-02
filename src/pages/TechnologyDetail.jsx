import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './TechnologyDetail.css';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { technologies, updateStatus, updateNotes } = useTechnologies();
    const technology = technologies.find(t => t.id === parseInt(techId));
    const [localNotes, setLocalNotes] = useState(technology?.notes || '');

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

    if (!technology) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} не существует.</p>
                <Link to="/technologies" className="btn"> ← Назад к списку </Link>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link"> ← Назад к списку </Link>
                <h1>{technology.title}</h1>
            </div>
            <div className="technology-detail">
                <div className="detail-section">
                    <h3>Описание</h3>
                    <p>{technology.description}</p>
                </div>
                <div className="detail-section">
                    <h3>Статус изучения</h3>
                    <div className="status-buttons">
                        <button
                            onClick={() => handleStatusChange('not-started')}
                            className={technology.status === 'not-started' ? 'active' : ''}
                        >
                            Не начато
                        </button>
                        <button
                            onClick={() => handleStatusChange('in-progress')}
                            className={technology.status === 'in-progress' ? 'active' : ''}
                        >
                            В процессе
                        </button>
                        <button
                            onClick={() => handleStatusChange('completed')}
                            className={technology.status === 'completed' ? 'active' : ''}
                        >
                            Завершено
                        </button>
                    </div>
                </div>
                <div className="detail-section">
                    <h3>Мои заметки</h3>
                    <textarea
                        value={localNotes}
                        onChange={handleNotesChange}
                        placeholder="Записывайте сюда свои важные моменты..."
                        rows="5"
                    />
                    <div className="notes-hint">
                        {localNotes.length > 0 ? `заметка сохранена (${localNotes.length} символов)` : 'Добавьте заметку'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;