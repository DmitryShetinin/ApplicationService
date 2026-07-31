import { useRef } from 'react';
import Column from './Column';
import TicketCard from './TicketCard';

export default function Board({ tickets, viewMode, onMove, onDelete, onEdit }) {
  const draggedTicketId = useRef(null);

  const handleDragStart = (e, ticketId) => {
    draggedTicketId.current = ticketId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ticketId);
  };

  const handleDrop = (e, status) => {
    const ticketId = e.dataTransfer.getData('text/plain') || draggedTicketId.current;
    if (ticketId) onMove(ticketId, status);
    draggedTicketId.current = null;
  };

  if (viewMode === 'kanban') {
    const columns = {
      1: tickets.filter(t => t.status === 1),
      2: tickets.filter(t => t.status === 2),
      3: tickets.filter(t => t.status === 3),
    };

    return (
      <div className="board-container">
        {[1, 2, 3].map(status => (
          <Column
            key={status}
            status={status}
            tickets={columns[status]}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onMove={onMove}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  // Сетка
  return (
    <div className="content">
      <div className="section-title">
        Задачи <span className="count">{tickets.length}</span>
      </div>
      {tickets.length > 0 ? (
        tickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onMove={onMove}
            onDelete={onDelete}
            onEdit={onEdit}
            draggable={false}
          />
        ))
      ) : (
        <div className="empty-filters">Нет задач, соответствующих фильтрам</div>
      )}
    </div>
  );
}