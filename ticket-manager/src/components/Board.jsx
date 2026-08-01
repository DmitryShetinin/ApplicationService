import { useState } from "react";
import Column from "./Column";
import TicketCard from "./TicketCard";


export default function Board({
  tickets,
  viewMode,
  onMove,
  onDelete,
  onEdit,
  page,
  totalPages,
  onPageChange
}) {

  const [draggedTicket, setDraggedTicket] = useState(null);


  const handleDragStart = (ticket) => {
    setDraggedTicket(ticket);
  };


  const handleDrop = (status) => {

    if (!draggedTicket)
      return;


    const allowed =
      draggedTicket.allowedTransitions?.some(
        transition =>
          transition.status === status
      );


    if (!allowed) {
      console.log(
        `Запрещенный переход ${draggedTicket.status} -> ${status}`
      );

      setDraggedTicket(null);
      return;
    }


    onMove(
      draggedTicket.id,
      status
    );


    setDraggedTicket(null);
  };


  if (viewMode === "kanban") {

    const columns = {
      1: tickets.filter(t => t.status === 1),
      2: tickets.filter(t => t.status === 2),
      3: tickets.filter(t => t.status === 3)
    };


    return (
      <div className="board-container">

        {[1, 2, 3].map(status => (

          <Column
            key={status}
            status={status}
            tickets={columns[status]}
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

      {
        tickets.map(ticket => (

          <TicketCard
            key={ticket.id}
            ticket={ticket}
            draggable={false}
            onMove={onMove}
            onDelete={onDelete}
            onEdit={onEdit}
          />

        ))
      }

      {viewMode === "grid" && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            ←
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            →
          </button>
        </div>
      )}

    </div>
  );
}