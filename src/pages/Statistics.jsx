import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './Statistics.css';

function Statistics() {
    const { technologies } = useTechnologies();
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        completionRate: 0,
        statusDistribution: {},
        topCompleted: [],
        longestInProgress: []
    });

    useEffect(() => {
        const total = technologies.length;
        const completed = technologies.filter(t => t.status === 'completed').length;
        const inProgress = technologies.filter(t => t.status === 'in-progress').length;
        const notStarted = technologies.filter(t => t.status === 'not-started').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const statusDistribution = {
            'completed': completed,
            'in-progress': inProgress,
            'not-started': notStarted
        };

        const topCompleted = [...technologies]
            .filter(t => t.status === 'completed')
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
            .slice(0, 5);

        const longestInProgress = [...technologies]
            .filter(t => t.status === 'in-progress')
            .sort((a, b) => {
                const timeA = new Date() - new Date(a.updatedAt || a.createdAt);
                const timeB = new Date() - new Date(b.updatedAt || b.createdAt);
                return timeB - timeA;
            })
            .slice(0, 5);

        setStats({
            total,
            completed,
            inProgress,
            notStarted,
            completionRate,
            statusDistribution,
            topCompleted,
            longestInProgress
        });
    }, [technologies]);

    return (
        <div className="page">
            <div className="page-header">
                <h1>Статистика</h1>
            </div>
            <div className="stats-overview">
                <div className="stat-card">
                    <h3>Всего технологий</h3>
                    <p className="stat-number">{stats.total}</p>
                </div>
                <div className="stat-card">
                    <h3>Завершено</h3>
                    <p className="stat-number">{stats.completed}</p>
                </div>
                <div className="stat-card">
                    <h3>В процессе</h3>
                    <p className="stat-number">{stats.inProgress}</p>
                </div>
                <div className="stat-card">
                    <h3>Не начато</h3>
                    <p className="stat-number">{stats.notStarted}</p>
                </div>
                <div className="stat-card">
                    <h3>Общий прогресс</h3>
                    <p className="stat-number">{stats.completionRate}%</p>
                </div>
            </div>

            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${stats.completionRate}%` }}></div>
            </div>

            <div className="stats-section">
                <h2>Распределение по статусам</h2>
                <div className="distribution-chart">
                    {Object.entries(stats.statusDistribution).map(([status, count]) => {
                        const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        let statusLabel = '';
                        let colorClass = '';
                        if (status === 'completed') { statusLabel = 'Завершено'; colorClass = 'chart-segment-completed'; }
                        if (status === 'in-progress') { statusLabel = 'В процессе'; colorClass = 'chart-segment-in-progress'; }
                        if (status === 'not-started') { statusLabel = 'Не начато'; colorClass = 'chart-segment-not-started'; }
                        return (
                            <div key={status} className="chart-segment">
                                <div className={`chart-segment-bar ${colorClass}`} style={{ width: `${percentage}%` }}></div>
                                <div className="chart-segment-label">
                                    <span>{statusLabel}: {count} ({percentage}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {stats.topCompleted.length > 0 && (
                <div className="stats-section">
                    <h2>Недавно завершенные</h2>
                    <ul>
                        {stats.topCompleted.map(tech => (
                            <li key={tech.id}>
                                <Link to={`/technology/${tech.id}`}>{tech.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {stats.longestInProgress.length > 0 && (
                <div className="stats-section">
                    <h2>Дольше всего в процессе</h2>
                    <ul>
                        {stats.longestInProgress.map(tech => (
                            <li key={tech.id}>
                                <Link to={`/technology/${tech.id}`}>{tech.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Statistics;