import { useState } from 'react';
import {Link} from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
    const { technologies, setTechnologies, setLocalData } = useTechnologies();
    const [showResetModal, setShowResetModal] = useState(false);
    const [showClearAllModal, setShowClearAllModal] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [showImportModal, setShowImportModal] = useState(false);
    const [importStatus, setImportStatus] = useState('');

    const handleResetAll = () => {
        const resetTechnologies = technologies.map(tech => ({
            ...tech,
            status: 'not-started',
            notes: '',
            deadline: '',
            priority: 'medium'
        }));
        setTechnologies(resetTechnologies);
        setShowResetModal(false);
        alert('Все статусы и заметки сброшены.');
    };

    const handleClearAll = () => {
        setTechnologies([]);
        setShowClearAllModal(false);
        alert('Все технологии удалены.');
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
                const newLocalData = {};
                importedTechs.forEach(tech => {
                    if (tech.id != null) {
                        newLocalData[tech.id] = {
                            status: tech.status || 'not-started',
                            notes: tech.notes || '',
                            deadline: tech.deadline || '',
                            priority: tech.priority || 'medium',
                            createdAt: tech.createdAt || new Date().toISOString(),
                            updatedAt: tech.updatedAt || new Date().toISOString(),
                        };
                    }
                });
                setLocalData(newLocalData);
                setImportStatus(`Успешно импортировано ${importedTechs.length} технологий`);
            } catch (error) {
                console.error('Ошибка импорта:', error);
                setImportStatus('Ошибка: неверный формат JSON или структуры данных');
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