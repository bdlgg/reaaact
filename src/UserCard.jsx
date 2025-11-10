function UserCard({name, role, avatarURL, isOnline}) {
    return (
        <div className="user-card">
            <div className="avatar-section">
                <img src={avatarURL} alt={`аватар: ${name}`} />
                <p>Статус: {isOnline ? 'online' : 'offline'}</p>
            </div>
            <div className="user-info">
                <h3>{name}</h3>
                <p>{role}</p>
            </div>
        </div>
    );
}
export default UserCard;