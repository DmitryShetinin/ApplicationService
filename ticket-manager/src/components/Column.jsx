import { useState } from 'react';
import TicketCard from './TicketCard';

const STATUS_NAMES = { 1: 'Новые', 2: 'В работе', 3: 'Завершено' };
const STATUS_EMPTY = { 1: 'Нет новых тикетов', 2: 'Нет тикетов в работе', 3: 'Нет завершённых тикетов' };
const INDICATOR_CLASS = { 1: 'indicator-new', 2: 'indicator-processing', 3: 'indicator-completed' };

export default function Column({ status, tickets, onDragStart, onDragOver, onDrop, onMove, onDelete, onEdit }) {
  const [dragOver, setDragOver] = useState(false);

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
        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { onDragOver(e); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { onDrop(e, status); setDragOver(false); }}
        >
          {tickets.length === 0 ? (
            <div className="empty-state">{STATUS_EMPTY[status]}</div>
          ) : (
            tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onDragStart={onDragStart}
                onMove={onMove}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}