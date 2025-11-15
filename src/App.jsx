import {useState} from "react";
import './App.css'
import TechnologyCard from "./components/TechnologyCard.jsx";
import ProgressHeader from "./components/ProgressHeader.jsx";
import QuickActions from "./components/QuickActions.jsx";
function App() {
    const [technologies, setTechnologies] = useState([
        {id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed', notes: ''},
        {id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress', notes: ''},
        {id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started', notes: ''},
    ]);
    const [filter, setFilter] = useState('all');

    const updateTechnologyStatus = (id, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech => (tech.id === id ? {...tech, status: newStatus} : tech))
        );
    };

    const markAllCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({...tech, status: 'completed'}))
        );
    }

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

    const filtedTechnologies = technologies.filter(tech => {
        if (filter === 'all') return true;
        return tech.status === filter;
    });

    return (
        <div className="App">
            <ProgressHeader technologies={technologies} />
            <QuickActions
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAll}
                onRandomNext={randomNext}
            />
            <div className="filter-buttons">
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Все</button>
                <button className={filter === 'not-started' ? 'active' : ''} onClick={() => setFilter('not-started')}>Не начато</button>
                <button className={filter === 'in-progress' ? 'active' : ''} onClick={() => setFilter('in-progress')}>В процессе</button>
                <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Завершено</button>
            </div>
            <div className="technologies-list">
                {filtedTechnologies.map(tech => (
                    <TechnologyCard
                    key={tech.id}
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    onStatusChange={(newStatus) => updateTechnologyStatus(tech.id, newStatus)}
                    />
                ))}
            </div>
        </div>
    );
}

export default App
