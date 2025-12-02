import { useState, useEffect } from 'react';
import './DeadlineForm.css';

function DeadlineForm({ onSave, onCancel, initialData = {} }) {
    const [formData, setFormData] = useState({
        deadline: initialData.deadline || '',
        priority: initialData.priority || 'medium'
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            onSave(formData);
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="deadline-form" noValidate>
            <div className="form-group">
                <label htmlFor="deadline">Дедлайн (необязательно)</label>
                <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={errors.deadline ? 'error' : ''}
                    aria-describedby={errors.deadline ? "deadline-error" : undefined}
                    aria-invalid={!!errors.deadline}
                />
                {errors.deadline && (
                    <span id="deadline-error" className="error-message" role="alert">
                        {errors.deadline}
                    </span>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="priority">Приоритет</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    aria-label="Выберите приоритет задачи"
                >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                </select>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
                    Сохранить
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Отмена
                </button>
            </div>
        </form>
    );
}

export default DeadlineForm;