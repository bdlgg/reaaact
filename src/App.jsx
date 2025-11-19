import {useEffect, useState} from "react";
import './App.css'
import TechnologyCard from "./components/TechnologyCard.jsx";
import ProgressHeader from "./components/ProgressHeader.jsx";
import QuickActions from "./components/QuickActions.jsx";
function App() {
    const [technologies, setTechnologies] = useState([
        {id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed', notes: ''},
        {id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'completed', notes: ''},
        {id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'in-progress', notes: ''},
        {id: 4, title: 'Postgres', description: 'Изучение работы с запросами в postgres', status: 'in-progress', notes: ''},
        {id: 5, title: 'useEffect', description: 'Работа с хуком useState', status: 'not-started', notes: ''}
    ]);

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('techTrackerData', JSON.stringify(technologies));
        console.log('Данные сохранены в localStorage');
    }, [technologies]);

    useEffect(() => {
        const saved = localStorage.getItem('techTrackerData');
        if (saved) {
            try {
                setTechnologies(JSON.parse(saved));
                console.log('Данные загружены из localStorage');
            }
            catch (e) {
                console.error('Ошибка при загрузке данных:', e);
            }
        }
    }, []);

    const updateTechnologyStatus = (id, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech => (tech.id === id ? {...tech, status: newStatus} : tech))
        );
    };

    const updateTechnologyNotes = (techId, newNotes) => {
        setTechnologies(prevTech =>
            prevTech.map(tech =>
                tech.id === techId ? {...tech, notes: newNotes} : tech
            )
        );
    };

    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({...tech, status: 'completed'}))
        );
    };

    const resetAll = () => {
        setTechnologies(prev =>
            prev.map(tech => ({...tech, status: 'not-started'}))
        );
    };

    const randomNext = () => {
        const notStarted = technologies.filter(t => t.status === 'not-started')
        if (notStarted.length === 0) return;
        const random = notStarted[Math.floor(Math.random() * notStarted.length)];
        updateTechnologyStatus(random.id, 'in-progress');
    }

    const byStatus = technologies.filter(tech => {
        if (filter === 'all') return true;
        return tech.status === filter;
    });

    const filteredTechnologies = byStatus.filter(tech =>
       tech.title.toLowerCase().includes(searchQuery.toLowerCase()) || tech.description.toLowerCase().includes(searchQuery.toLowerCase())
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
                    onStatusChange={(newStatus) => updateTechnologyStatus(tech.id, newStatus)}
                    onNotesChange={updateTechnologyNotes}
                    />
                ))}
            </div>
        </div>
    );
}

export default App
