export default function ActivityFeed({ events }) {
  if (events.length === 0) {
    return (
      <p className="empty-note">Activity appears here as you investigate messages and complete missions.</p>
    );
  }

  return (
    <ol className="activity">
      {events.map((event) => (
        <li key={event.id} className="activity__item">
          <span className="activity__time">
            {new Date(event.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="activity__text">{event.text}</span>
          {event.xp > 0 ? <span className="activity__xp">+{event.xp} XP</span> : <span />}
        </li>
      ))}
    </ol>
  );
}
