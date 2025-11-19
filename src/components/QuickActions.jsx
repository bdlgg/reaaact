import './TechnologyCard.css';
import { useState } from "react";
import Modal from './Modal';

function QuickActions({onMarkAllCompleted, onResetAll, onRandomNext, technologies}) {
    const [showExportModal, setShowExportModal] = useState(false);
    const handleExport = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        console.log("Данные для экспорта:", JSON.stringify(exportData, null, 2));
        setShowExportModal(true);
    };
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
            </div>
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