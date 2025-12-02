import './TechnologyCard.css';
import { useState } from "react";
import Modal from './Modal';

function QuickActions({onMarkAllCompleted, onResetAll, onRandomNext, technologies, onBulkUpdate}) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [newStatusForSelected, setNewStatusForSelected] = useState('not-started');
    const [showBulkModal, setShowBulkModal] = useState(false);
    const handleExport = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        console.log("Данные для экспорта:", JSON.stringify(exportData, null, 2));
        setShowExportModal(true);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === technologies.length){
            setSelectedIds(new Set());
        }
        else {
            setSelectedIds(new Set(technologies.map(t => t.id)))
        }
    };

    const handleSelectOne = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)){
            newSelected.delete(id);
        }
        else{
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    }

    const handleApplyToSelected = () => {
        if (selectedIds.size === 0) return;
        const idsToUpdate = Array.from(selectedIds);
        onBulkUpdate(idsToUpdate, newStatusForSelected);
        setSelectedIds(new Set());
        setShowBulkModal(false);
    };

    const isApplyDisabled = selectedIds.size === 0;

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button onClick={onMarkAllCompleted} className="btn btn-success">
                    ✅ Отметить все как выполненные
                </button>
                <button onClick={onResetAll} className="btn btn-warning">
                    🔄 Сбросить все статусы
                </button>
                <button onClick={onRandomNext} className="btn btn-random">
                    🎲 Случайный выбор следующей
                </button>
                <button onClick={handleExport} className="btn btn-info">
                    📤 Экспорт данных
                </button>
                <button onClick={() => setShowBulkModal(true)} className="btn-secondary">
                    📋 Массовое редактирование
                </button>
            </div>
            <Modal
                isOpen={showBulkModal}
                onClose={() => {setShowBulkModal(false); setSelectedIds(new Set());}}
                title="Массовое редактирование статусов"
            >
                <div className="bulk-edit-modal-content">
                    <div className="bulk-controls">
                        <button onClick={handleSelectAll} className="btn btn-secondary">
                            {selectedIds.size === technologies.length ? 'Снять выделение' : 'Выделить все'}
                        </button>
                        <select
                            value={newStatusForSelected}
                            onChange={(e) => setNewStatusForSelected(e.target.value)}
                            className="status-select"
                            aria-label="Выберите новые статус для выделенных элементов">
                            <option value="not-started">Не начато</option>
                            <option value="in-progress">В процессе</option>
                            <option value="completed">Завершено</option>
                        </select>
                        <button onClick={handleApplyToSelected} className="btn btn-primary" disabled={isApplyDisabled} aria-disabled={isApplyDisabled}>
                            Применить к выбранным ({selectedIds.size})
                        </button>
                    </div>
                    <div className="technologies-to-edit">
                        {technologies.map(tech => (
                            <div key={tech.id} className="tech-item">
                                <label className="tech-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(tech.id)}
                                        onChange={() => handleSelectOne(tech.id)}
                                        aria-label={`Выбрать ${tech.title} для массового редактирования`}/>
                                    <span className="tech-title">{tech.title}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <p>данные успешно подготовлены для экспорта</p>
                <p>проверьте консоль разработчика для просмотра данных</p>
            </Modal>
        </div>
    )
}
export default QuickActions;