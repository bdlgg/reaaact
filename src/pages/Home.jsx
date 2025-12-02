import {Link} from "react-router-dom";
import ProgressHeader from "../components/ProgressHeader.jsx";
import QuickActions from "../components/QuickActions.jsx";
import useTechnologies from "../hooks/useTechnologies.jsx";
function Home() {
    const {technologies, markAllCompleted, resetAll, randomNext} = useTechnologies();
    return (
        <div className="page">
            <ProgressHeader  technologies={technologies} />
            <QuickActions
                technologies={technologies}
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAll}
                onRandomNext={randomNext}
            />
            <div className="home-content">
                <h2>Добро пожаловать на мой первый сайт на React</h2>
                <p>Здесь вы можете отслеживать мой прогресс</p>
                <div className="home-links">
                    <Link to="/technologies" className="btn btn-primary">Просмотреть все технологии</Link>
                    <Link to="/add-technology" className="btn btn-secondary">Добавить новую</Link>
                </div>
            </div>
        </div>
    )
}
export default Home;