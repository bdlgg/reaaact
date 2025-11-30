import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
    const { technologies, setTechnologies } = useTechnologies();
    const [showResetModal, setShowResetModal] = useState(false);
    const [showClearAllModal, setShowClearAllModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState('');

    const handleResetAll = () => {
        const resetTechnologies = technologies.map(tech => ({
            ...tech,
            status: 'not-started',
            notes: ''
        }));
        setTechnologies(resetTechnologies);
        setShowResetModal(false);
        alert('Все статусы и заметки сброшены.');
    };

    const handleClearAll = () => {
        setTechnologies([]); // Устанавливаем пустой массив
        setShowClearAllModal(false);
        alert('Все технологии удалены.');
    };

    const handleImport = () => {
        try {
            const parsedData = JSON.parse(importData);
            if (Array.isArray(parsedData) && parsedData.every(item => item.id && item.title)) {
                setTechnologies(parsedData);
                setShowImportModal(false);
                setImportData('');
                alert('Данные успешно импортированы.');
            } else {
                alert('Неверный формат данных. Ожидается массив объектов с полями id и title.');
            }
        } catch (e) {
            alert('Ошибка при разборе JSON. Проверьте формат данных.');
        }
    };

    const handleExport = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tech-tracker-export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Настройки</h1>
            </div>
            <div className="settings-content">
                <h2>Управление данными</h2>
                <div className="settings-buttons">
                    <button onClick={() => setShowResetModal(true)} className="btn btn-warning"> 🔄 Сбросить все статусы и заметки </button>
                    <button onClick={() => setShowClearAllModal(true)} className="btn btn-danger">🗑️ Удалить все технологии</button>
                    <button onClick={handleExport} className="btn btn-info">📤 Экспорт данных</button>
                    <button onClick={() => setShowImportModal(true)} className="btn btn-info">📥 Импорт данных</button>
                </div>
            </div>

            {/* Модальное окно подтверждения сброса */}
            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Подтверждение сброса"
            >
                <p>Вы уверены, что хотите сбросить статусы и заметки для всех технологий?</p>
                <p>Это действие нельзя отменить.</p>
                <div className="modal-actions">
                    <button onClick={handleResetAll} className="btn btn-danger">Да, сбросить</button>
                    <button onClick={() => setShowResetModal(false)} className="btn btn-secondary">Отмена</button>
                </div>
            </Modal>

            {/* Модальное окно подтверждения удаления */}
            <Modal
                isOpen={showClearAllModal}
                onClose={() => setShowClearAllModal(false)}
                title="Подтверждение удаления"
            >
                <p>Вы уверены, что хотите удалить ВСЕ технологии?</p>
                <p>Все данные будут потеряны. Это действие нельзя отменить.</p>
                <div className="modal-actions">
                    <button onClick={handleClearAll} className="btn btn-danger">Да, удалить всё</button>
                    <button onClick={() => setShowClearAllModal(false)} className="btn btn-secondary">Отмена</button>
                </div>
            </Modal>

            {/* Модальное окно импорта */}
            <Modal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                title="Импорт данных"
            >
                <p>Вставьте JSON-данные для импорта:</p>
                <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder='{"exportedAt": "...", "technologies": [...]}'
                    rows="8"
                />
                <div className="modal-actions">
                    <button onClick={handleImport} className="btn btn-primary">Импортировать</button>
                    <button onClick={() => setShowImportModal(false)} className="btn btn-secondary">Отмена</button>
                </div>
            </Modal>
        </div>
    );
}

export default Settings;