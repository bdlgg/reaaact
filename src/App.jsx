import {useState} from "react";
import './App.css'
import TechnologyCard from "./components/TechnologyCard.jsx";
import ProgressHeader from "./components/ProgressHeader.jsx";
import QuickActions from "./components/QuickActions.jsx";
import useTechnologies from "./components/useTechnologies.jsx";
function App() {
    const {
        technologies, updateStatus, updateNotes, markAllCompleted, resetAll, randomNext
    } = useTechnologies();

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const byStatus = technologies.filter(tech => {
        if (filter === 'all') return true;
        return tech.status === filter;
    });

    const filteredTechnologies = byStatus.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="App">
            <ProgressHeader technologies={technologies} />
            <QuickActions
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAll}
                onRandomNext={randomNext}
                technologies={technologies}
            />
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-count">Найдено: {filteredTechnologies.length}</span>
            </div>
            <div className="filter-buttons">
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Все</button>
                <button className={filter === 'not-started' ? 'active' : ''} onClick={() => setFilter('not-started')}>Не начато</button>
                <button className={filter === 'in-progress' ? 'active' : ''} onClick={() => setFilter('in-progress')}>В процессе</button>
                <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Завершено</button>
            </div>
            <div className="technologies-list">
                {filteredTechnologies.map(tech => (
                    <TechnologyCard
                        key={tech.id}
                        id={tech.id}
                        title={tech.title}
                        description={tech.description}
                        status={tech.status}
                        notes={tech.notes}
                        onStatusChange={(newStatus) => updateStatus(tech.id, newStatus)}
                        onNotesChange={updateNotes}
                    />
                ))}
            </div>
        </div>
    );
}

export default App