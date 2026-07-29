import { employees, formatDate, getDeadlineClass, getDeadlineLabel } from '../utils';

const STATUS_CLASS = { 1: 'status-new', 2: 'status-processing', 3: 'status-completed' };

export default function TicketCard({ ticket, onDragStart, onMove, onDelete, onEdit }) {
  const author = employees.find(e => e.id === ticket.authorId) || employees[0];
  const executor = employees.find(e => e.id === ticket.executorId) || employees[0];
  const deadlineClass = getDeadlineClass(ticket.deadline);
  const deadlineLabel = getDeadlineLabel(ticket.deadline);

  return (
    <div
      className={`ticket-card ${STATUS_CLASS[ticket.status]}`}
      draggable
      onDragStart={(e) => onDragStart(e, ticket.id)}
      onClick={() => onEdit(ticket)}
    >
      <div className="ticket-id">{ticket.id.substring(0, 13)}…</div>
      <div className="ticket-number">#{ticket.number}</div>
      <div className="ticket-description">{ticket.description}</div>
      <div className="ticket-meta">
        <span className="ticket-meta-item"><span className="ticket-avatar author">{author.initials}</span> {author.name}</span>
        <span className="ticket-meta-item"><span className="ticket-avatar executor">{executor.initials}</span> {executor.name}</span>
      </div>
      <div className="ticket-meta" style={{ marginTop: 4 }}>
        <span className="ticket-meta-item">
          📅 {formatDate(ticket.createdAt)}
        </span>
        <span className={`deadline-badge ${deadlineClass}`}>
          ⏱ {deadlineLabel}
        </span>
      </div>
      <div className="ticket-actions">
        {ticket.status === 1 && <button className="btn btn-xs btn-primary" onClick={(e) => { e.stopPropagation(); onMove(ticket.id, 2); }}>▶ В работу</button>}
        {ticket.status === 2 && <button className="btn btn-xs btn-primary" onClick={(e) => { e.stopPropagation(); onMove(ticket.id, 3); }}>✓ Завершить</button>}
        {ticket.status === 2 && <button className="btn btn-xs btn-ghost" onClick={(e) => { e.stopPropagation(); onMove(ticket.id, 1); }}>← Назад</button>}
        {ticket.status === 3 && <button className="btn btn-xs btn-ghost" onClick={(e) => { e.stopPropagation(); onMove(ticket.id, 2); }}>↻ Переоткрыть</button>}
        <button className="btn btn-xs btn-ghost" style={{ marginLeft: 'auto', color: '#f87171' }} onClick={(e) => { e.stopPropagation(); onDelete(ticket.id); }}>🗑</button>
      </div>
    </div>
  );
}