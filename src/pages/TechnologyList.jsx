import {Link} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import useTechnologies from "../hooks/useTechnologies.jsx";
import QuickActions from "../components/QuickActions.jsx";
import TechnologyCard from "../components/TechnologyCard.jsx";
import './TechnologyList.css';
function TechnologyList() {
    const {technologies, loading, error, refetch, updateStatus, markAllCompleted, resetAll, randomNext, bulkUpdateStatus } = useTechnologies();
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 700);
        return () => clearTimeout(timeoutRef.current);
    }, [searchQuery]);

    const byStatus = technologies.filter(tech => {
        if (filter === 'all') return true;
        return tech.status === filter;
    });
    const filteredTechnologies = byStatus.filter(tech =>
        tech.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="page">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Загрузка технологий...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="page">
                <div className="error-state">
                    <h2>Ошибка загрузки</h2>
                    <p>{error}</p>
                    <button onClick={refetch} className="btn btn-primary">Попробовать снова</button>
                </div>
            </div>
        )
    }
    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">+ Добавить технологию</Link>
            </div>
            <QuickActions
                technologies={technologies}
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAll}
                onRandomNext={randomNext}
                onBulkUpdate={bulkUpdateStatus}
            />
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}/>
                <span className="search-count">Найдено: {filteredTechnologies.length}</span>
            </div>
            <div className="filter-buttons">
                <button className={filter === "all" ? "active" : ""} onClick={() => setFilter('all')}>Все</button>
                <button className={filter === 'not-started' ? 'active' : ''} onClick={() => setFilter('not-started')}>Не начато</button>
                <button className={filter === 'in-progress' ? 'active' : ''} onClick={() => setFilter('in-progress')}>В процессе</button>
                <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Завершено</button>
            </div>

            <div className="technologies-grid">
                {filteredTechnologies.map(tech => (
                    <div key={tech.id} className="technology-item">
                        <h3>{tech.title}</h3>
                        <p>{tech.description}</p>
                        <div className="technology-meta">
                            <span
                                className={`status status-${tech.status}`}
                                onClick={() => {
                                    let newStatus = 'not-started';
                                    if (tech.status === 'not-started') newStatus = 'in-progress';
                                    else if (tech.status === 'in-progress') newStatus = 'completed';
                                    else if (tech.status === 'completed') newStatus = 'not-started';
                                    updateStatus(tech.id, newStatus)
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                {tech.status === "completed" && '✅ завершено'}
                                {tech.status === "in-progress" && '⏳ в процессе'}
                                {tech.status === "not-started" && '⚪ не начато'}
                            </span>
                            <Link to={`/technology/${tech.id}`} className="btn btn-link">Подробнее →</Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTechnologies.length === 0 && (
                <div className="empty-state">
                    <p>Технологий пока нет</p>
                    <Link to="/add-technology" className="btn btn-primary">Добавить первую технологию</Link>
                </div>
            )}
        </div>
    );
}
export default TechnologyList;