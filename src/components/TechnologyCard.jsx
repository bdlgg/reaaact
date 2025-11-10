import './TechnologyCard.css'
function TechnologyCard({title, description, status}) {
    return (
        <div className={`technology-card status-${status}`}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="status-indicator">
                {status === "completed" && '✅ завершено'}
                {status === "in-progress" && '⏳ в процессе'}
                {status === "not-started" && '⚪ не начато'}
            </div>
        </div>
    );
}
export default TechnologyCard;