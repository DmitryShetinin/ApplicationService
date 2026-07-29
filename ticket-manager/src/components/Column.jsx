import TicketCard from './TicketCard';

const STATUS_NAMES = { 1: 'Новые', 2: 'В работе', 3: 'Завершено' };
const STATUS_EMPTY = { 1: 'Нет новых тикетов', 2: 'Нет тикетов в работе', 3: 'Нет завершённых тикетов' };
const INDICATOR_CLASS = { 1: 'indicator-new', 2: 'indicator-processing', 3: 'indicator-completed' };

export default function Column({ status, tickets, isDragOver, onDragStart, onMove, onDelete, onEdit }) {
  return (
    <div className="column" data-status={status}>
      <div className="column-header">
        <div className="column-header-left">
          <div className={`column-indicator ${INDICATOR_CLASS[status]}`} />
          <span className="column-title">{STATUS_NAMES[status]}</span>
        </div>
        <span className="column-count">{tickets.length}</span>
      </div>
      <div className="column-body">
        <div className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}>
          {tickets.length === 0 ? (
            <div className="empty-state">{STATUS_EMPTY[status]}</div>
          ) : (
            tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onMove={onMove}
                onDelete={onDelete}
                onEdit={onEdit}
                draggable={true}
                onDragStart={onDragStart}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}