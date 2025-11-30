import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import useTechnologies from "../hooks/useTechnologies.jsx";
import './TechnologyList.css';
function TechnologyList() {
    const {technologies} = useTechnologies();
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const byStatus = technologies.filter(tech => {
        if (filter === 'all') return true;
        return tech.status === filter;
    });
    const filteredTechnologies = byStatus.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">+ Добавить технологию</Link>
            </div>
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
                            <span className={`status status-${tech.status}`}>
                                {tech.status === "completed" && '✅ завершено'}
                                {tech.status === "in-progress" && '⏳ в процессе'}
                                {tech.status === "not-started" && '⚪ не начато'}
                            </span>
                            <Link to={`/technology/${tech.id}`} className="btn btn-link">Подробнее → </Link>
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