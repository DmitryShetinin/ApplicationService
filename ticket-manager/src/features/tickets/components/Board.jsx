import { useState } from "react";
import Column from "./Column";
import TicketCard from "./TicketCard";

export default function Board({
  viewMode,
  tickets,
  columns,
  loadMore,
  onMove,
  onDelete,
  onEdit
}) {
  const [draggedTicket, setDraggedTicket] = useState(null);

  const handleDragStart = (ticket) => {
    setDraggedTicket(ticket);
  };

  const handleDrop = (status) => {
    if (!draggedTicket) return;
    const allowed = draggedTicket.allowedTransitions?.some(
      x => x.status === status
    );
    if (!allowed) {
      console.log(`Запрещенный переход ${draggedTicket.status} -> ${status}`);
      setDraggedTicket(null);
      return;
    }
    onMove(draggedTicket.id, status);
    setDraggedTicket(null);
  };

  if (viewMode === "kanban") {
    return (
      <div className="board-container">
        {[1, 2, 3].map(status => (
          <Column
            key={status}
            status={status}
            tickets={columns[status].items}
            loading={columns[status].loading}
            onLoadMore={() => loadMore(status)}
            draggedTicket={draggedTicket}
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

  return (
    <div className="content">
      {tickets.map(ticket => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          author={ticket.author}
          executor={ticket.executor}
          draggable={false}
          onMove={onMove}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}