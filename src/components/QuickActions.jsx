import './TechnologyCard.css';

function QuickActions({onMarkAllCompleted, onResetAll, onRandomNext}) {
    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className='quick-buttons'>
                <button onClick={onMarkAllCompleted}>✅ Отметить все как выполнено</button>
                <button onClick={onResetAll}>↺ Сбросить все статусы</button>
                <button onClick={onRandomNext}>🎲 Случайный выбор следующей</button>
            </div>
        </div>
    )
}
export default QuickActions;