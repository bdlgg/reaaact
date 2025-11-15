function ProgressHeader({technologies}) {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const percent = total > 0 ? Math.round((completed/total) * 100) : 0;
    return (
        <div className="progress-header">
            <h2>Дорожная карта обучения</h2>
            <div className="stats">
                <span>Всего технологий: <strong>{total}</strong></span>
                <span>Завершено: <strong>{completed}</strong></span>
                <span>Прогресс: <strong>{percent}%</strong></span>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{width: `${percent}%`}}></div>
            </div>
        </div>
    );
}
export default ProgressHeader;