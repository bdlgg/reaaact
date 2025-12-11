import './TechnologyCard.css'
import TechnologyNotes from "./TechnologyNotes.jsx";
function TechnologyCard({id, title, description, status, notes, resources, onStatusChange, onNotesChange}) {
    const nextStatus = (current) => {
        if (current === 'not-started') return 'in-progress';
        if (current === 'in-progress') return 'completed';
        return 'not-started';
    }
    const handleClick = () => {
        onStatusChange(nextStatus(status));
    }
    return (
        <div className={`technology-card status-${status}`}>
            <h3>{title}</h3>
            <p>{description}</p>
            {resources && resources.length > 0 && (
                <div className="resources-links">
                    <strong>Ресурсы:</strong>
                    <ul>
                        {resources.map((url, idx) => (
                            <li key={idx}>
                                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="status-indicator" onClick={handleClick}>
                {status === "completed" && '✅ завершено'}
                {status === "in-progress" && '⏳ в процессе'}
                {status === "not-started" && '⚪ не начато'}
            </div>
            <TechnologyNotes
                notes={notes}
                onNotesChange={onNotesChange}
                techId={id}
            />
        </div>
    );
}
export default TechnologyCard;