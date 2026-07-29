import { useRef, useCallback } from 'react';
import Column from './Column';

const STATUSES = [1, 2, 3];

export default function Board({ tickets, onMove, onDelete, onEdit }) {
  const draggedTicketId = useRef(null);

  const handleDragStart = (e, ticketId) => {
    draggedTicketId.current = ticketId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ticketId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain') || draggedTicketId.current;
    if (ticketId) onMove(ticketId, newStatus);
    draggedTicketId.current = null;
  };

  const grouped = {};
  STATUSES.forEach(s => grouped[s] = tickets.filter(t => t.status === s));

  return (
    <div className="board-container">
      {STATUSES.map(status => (
        <Column
          key={status}
          status={status}
          tickets={grouped[status]}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMove={onMove}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}