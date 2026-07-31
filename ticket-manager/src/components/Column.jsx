import { useRef, useEffect, useState } from 'react';
import TicketCard from './TicketCard';

const STATUS_NAMES = { 1: 'Новые', 2: 'В работе', 3: 'Завершено' };
const STATUS_EMPTY = { 1: 'Нет новых тикетов', 2: 'Нет тикетов в работе', 3: 'Нет завершённых тикетов' };
const INDICATOR_CLASS = { 1: 'indicator-new', 2: 'indicator-processing', 3: 'indicator-completed' };

export default function Column({ status, tickets, onDragStart, onDrop, onMove, onDelete, onEdit }) {
  const [dragOver, setDragOver] = useState(false);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    const zone = dropZoneRef.current;
    if (!zone) return;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Если зашли первый раз или извне
      if (!zone.contains(e.relatedTarget)) {
        setDragOver(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Если действительно покинули зону (relatedTarget не потомок)
      if (!zone.contains(e.relatedTarget)) {
        setDragOver(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      onDrop(e, status);
    };

    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', handleDrop);

    return () => {
      zone.removeEventListener('dragenter', handleDragEnter);
      zone.removeEventListener('dragleave', handleDragLeave);
      zone.removeEventListener('dragover', (e) => e.preventDefault());
      zone.removeEventListener('drop', handleDrop);
    };
  }, [status, onDrop]);

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-header-left">
          <div className={`column-indicator ${INDICATOR_CLASS[status]}`} />
          <span className="column-title">{STATUS_NAMES[status]}</span>
        </div>
        <span className="column-count">{tickets.length}</span>
      </div>
      <div className="column-body">
        <div className={`drop-zone ${dragOver ? 'drag-over' : ''}`} ref={dropZoneRef}>
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