import { useState } from "react";
import {
  formatDate,
  getDeadlineClass,
  getDeadlineLabel
} from "../../../shared/utils/date.js";

const STATUS_CLASS = {
  1: "status-new",
  2: "status-processing",
  3: "status-completed"
};

export function getInitials(fullName) {
  if (!fullName) return '??';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0]?.[0]?.toUpperCase() ?? '?';
  const lastName = parts[0];
  const firstName = parts[1];
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export default function TicketCard({
  ticket,
  author,
  executor,
  onMove,
  onDelete,
  onEdit,
  draggable = false,
  onDragStart
}) {
  const [dragging, setDragging] = useState(false);
 
  const deadlineClass = getDeadlineClass(ticket.deadline);
  const deadlineLabel = getDeadlineLabel(ticket.deadline);

  const handleDragStart = (e) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ticket.id);
    onDragStart?.(ticket);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };
 
  return (
    <div
      className={`ticket-card ${STATUS_CLASS[ticket.status]} ${dragging ? "dragging" : ""}`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit(ticket)}
    >
      {/* 👇 Добавленная должность исполнителя */}
      {executor?.position && (
        <div className="ticket-position">
          {executor.position}
        </div>
      )}

      <div className="ticket-id">
        {ticket.id.substring(0,13)}…
      </div>

      <div className="ticket-number">
        #{ticket.number}
      </div>

      <div className="ticket-description">
        {ticket.description}
      </div>

      <div className="ticket-meta ticket-meta-people">
        <span className="ticket-meta-item">
          <span className="ticket-avatar author">
            {getInitials(author.fullName)}
          </span>
          {author?.fullName} ({author?.department})
        </span>

        <span className="ticket-meta-item">
          <span className="ticket-avatar executor">
            {getInitials(executor?.fullName)}
          </span>
          {executor?.fullName} ({executor?.department})
        </span>
      </div>

      <div className="ticket-meta" style={{marginTop:4}}>
        <span className="ticket-meta-item">
          📅 {formatDate(ticket.createdAt)}
        </span>
        <span className={`deadline-badge ${deadlineClass}`}>
          ⏱ {deadlineLabel}
        </span>
      </div>

      <div className="ticket-actions">
        {ticket.status === 1 && (
          <button className="btn btn-xs btn-primary" onClick={(e) => { e.stopPropagation(); onMove(ticket.id,2); }}>
            ▶ В работу
          </button>
        )}
        {ticket.status === 2 && (
          <button className="btn btn-xs btn-primary" onClick={(e) => { e.stopPropagation(); onMove(ticket.id,3); }}>
            ✓ Завершить
          </button>
        )}
        {ticket.status === 2 && (
          <button className="btn btn-xs btn-ghost" onClick={(e) => { e.stopPropagation(); onMove(ticket.id,1); }}>
            ← Назад
          </button>
        )}
        {ticket.status === 3 && (
          <button className="btn btn-xs btn-ghost" onClick={(e) => { e.stopPropagation(); onMove(ticket.id,2); }}>
            ↻ Переоткрыть
          </button>
        )}
        <button className="btn btn-xs btn-ghost" style={{marginLeft:"auto", color:"#f87171"}} onClick={(e) => { e.stopPropagation(); onDelete(ticket.id); }}>
          🗑
        </button>
      </div>
    </div>
  );
}