import { useRef, useState, useCallback } from 'react';
import Column from './Column';
import TicketCard from './TicketCard';

export default function Board({ tickets, viewMode, onMove, onDelete, onEdit }) {
  const draggedTicketId = useRef(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const boardRef = useRef(null);

  const handleDragStart = (e, ticketId) => {
    draggedTicketId.current = ticketId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ticketId);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!boardRef.current || viewMode !== 'kanban') return;

    const columns = boardRef.current.querySelectorAll('.column');
    let newStatus = null;
    columns.forEach(col => {
      const rect = col.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        newStatus = parseInt(col.dataset.status, 10);
      }
    });
    setDragOverStatus(newStatus);
  }, [viewMode]);

  const handleDrop = (e) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain') || draggedTicketId.current;
    if (dragOverStatus && ticketId) {
      onMove(ticketId, dragOverStatus);
    }
    setDragOverStatus(null);
    draggedTicketId.current = null;
  };

  const handleDragEnd = () => {
    setDragOverStatus(null);
  };

  if (viewMode === 'kanban') {
    const columns = {
      1: tickets.filter(t => t.status === 1),
      2: tickets.filter(t => t.status === 2),
      3: tickets.filter(t => t.status === 3),
    };

    return (
      <div
        className="board-container"
        ref={boardRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        {[1, 2, 3].map(status => (
          <Column
            key={status}
            status={status}
            tickets={columns[status]}
            isDragOver={dragOverStatus === status}
            onDragStart={handleDragStart}
            onMove={onMove}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  // Сетка (без drag-and-drop)
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