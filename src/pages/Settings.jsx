import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
    const { setLocalData } = useTechnologies();
    const [showResetModal, setShowResetModal] = useState(false);
    const [showClearAllModal, setShowClearAllModal] = useState(false);
    const [importStatus, setImportStatus] = useState('');

    const handleResetAll = () => {
        setShowResetModal(false);
        alert('Функция сброса реализована на главной странице');
    };

    const handleClearAll = () => {
        setLocalData({});
        localStorage.removeItem('techTrackerUserData');
        setShowClearAllModal(false);
        alert('Все технологии удалены. Обновите страницу.');
    };

    const handleExport = () => {
        const savedData = localStorage.getItem('techTrackerUserData');
        const localData = savedData ? JSON.parse(savedData) : {};
        const technologies = [];
        for (const [id, data] of Object.entries(localData)) {
            if (data && data.title) {
                technologies.push({
                    id: parseInt(id),
                    title: data.title,
                    description: data.description || '',
                    category: data.category || 'other',
                    resources: data.resources || [],
                    status: data.status || 'not-started',
                    notes: data.notes || '',
                    deadline: data.deadline || '',
                    priority: data.priority || 'medium',
                    createdAt: data.createdAt || new Date().toISOString(),
                    updatedAt: data.updatedAt || new Date().toISOString(),
                });
            }
        }

        const exportData = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        setImportStatus('');
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const parsedData = JSON.parse(content);
                let importedTechs = [];
                if (parsedData && Array.isArray(parsedData.technologies)) {
                    importedTechs = parsedData.technologies;
                } else if (Array.isArray(parsedData)) {
                    importedTechs = parsedData;
                } else {
                    throw new Error('Неверный формат данных. Ожидается объект с полем "technologies" или массив');
                }
                if (importedTechs.length === 0) {
                    setImportStatus('В файле нет данных для импорта');
                    return;
                }
                const newLocalData = {};
                const now = new Date().toISOString();
                let importedCount = 0;
                importedTechs.forEach(tech => {
                    if (tech.id != null && tech.title) {
                        newLocalData[tech.id] = {
                            title: tech.title,
                            description: tech.description || '',
                            category: tech.category || 'other',
                            resources: tech.resources || [],
                            status: tech.status || 'not-started',
                            notes: tech.notes || '',
                            deadline: tech.deadline || '',
                            priority: tech.priority || 'medium',
                            createdAt: tech.createdAt || now,
                            updatedAt: tech.updatedAt || now,
                        };
                        importedCount++;
                    }
                });
                localStorage.setItem('techTrackerUserData', JSON.stringify(newLocalData));
                setLocalData(newLocalData);
                setImportStatus(`Успешно импортировано ${importedCount} технологий. Обновите страницу (F5).`);
            } catch (error) {
                console.error('Ошибка импорта:', error);
                setImportStatus(`Ошибка: ${error.message}`);
            }
        };
        reader.onerror = () => {
            setImportStatus('Ошибка: Не удалось прочитать файл.');
        };
        reader.readAsText(file);
        event.target.value = '';
    };
    const handleImportClick = () => {
        document.getElementById('import-file-input').click();
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
                    <button onClick={handleImportClick} className="btn btn-info">📥 Импорт данных</button>
                    <input
                        id="import-file-input"
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                    />
                </div>
                {importStatus && (
                    <div className={`status-message ${importStatus.startsWith('Ошибка') ? 'error' : 'success'}`}>
                        {importStatus}
                    </div>
                )}
                <div className="import-hint">
                    <p><strong>Важно:</strong> После импорта обновите страницу (F5)</p>
                    <p><strong>Формат JSON файла:</strong></p>
                    <ul>
                        <li>Массив объектов с технологиями</li>
                        <li>Обязательные поля: id, title</li>
                        <li>Опциональные: description, category, resources, status, notes, deadline, priority</li>
                    </ul>
                </div>
            </div>
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
        </div>
    );
}

export default Settings;