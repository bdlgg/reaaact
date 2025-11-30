import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './AddTechnology.css';

function AddTechnology() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { technologies, setTechnologies } = useTechnologies(); // Получаем сеттер из хука

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Название технологии обязательно.');
            return;
        }
        if (!description.trim()) {
            setError('Описание технологии обязательно.');
            return;
        }

        setError('');

        const newTechnology = {
            id: Math.max(...technologies.map(t => t.id), 0) + 1, // Простая генерация ID
            title: title.trim(),
            description: description.trim(),
            status: 'not-started',
            notes: ''
        };

        setTechnologies([...technologies, newTechnology]);
        navigate('/technologies'); // Перенаправляем на список после добавления
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добавить новую технологию</h1>
            </div>
            <form className="add-technology-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="title">Название:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Например, React Router"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Описание:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Краткое описание технологии..."
                        rows="4"
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                    <button type="button" onClick={() => navigate('/technologies')} className="btn btn-secondary">Отмена</button>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;