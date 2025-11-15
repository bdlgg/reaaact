import './TechnologyCard.css'
import TechnologyNotes from "./TechnologyNotes.jsx";
function TechnologyCard({id, title, description, status, notes, onStatusChange, onNotesChange}) {
    const nextStatus = (current) => {
        if (current === 'not-started') return 'in-progress';
        if (current === 'in-progress') return 'completed';
        return 'not-started';
    }
    const handleClick = () => {
        onStatusChange(nextStatus(status));
    }
    return (
        <div className={`technology-card status-${status}`} onClick={handleClick}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="status-indicator">
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