import { useEffect, useRef, useState } from "react";
import TicketCard from "./TicketCard";

const STATUS_NAMES = {
  1: "Новые",
  2: "В работе",
  3: "Завершено"
};

const STATUS_EMPTY = {
  1: "Нет новых тикетов",
  2: "Нет тикетов в работе",
  3: "Нет завершённых тикетов"
};

const INDICATOR_CLASS = {
  1: "indicator-new",
  2: "indicator-processing",
  3: "indicator-completed"
};

export default function Column({
  status,
  tickets,
  loading,
  onLoadMore,
  draggedTicket,
  onDragStart,
  onDrop,
  onMove,
  onDelete,
  onEdit
}) {

  const [dragOver, setDragOver] = useState(false);

  const bodyRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {

    if (!loaderRef.current || !bodyRef.current)
      return;

    const observer = new IntersectionObserver(

      entries => {

        if (entries[0].isIntersecting) {
          console.log("LOAD");
          onLoadMore();
        }

      },

      {
        root: bodyRef.current,
        threshold: 0.1
      }

    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();

  }, [onLoadMore]);

  const canDrop =
    draggedTicket &&
    draggedTicket.allowedTransitions?.some(
      x => x.status === status
    );

  const handleDragOver = e => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    onDrop(status);
  };

  return (
    <div className="column">

      <div className="column-header">
        <div className="column-header-left">
          <div className={`column-indicator ${INDICATOR_CLASS[status]}`} />
          <span className="column-title">
            {STATUS_NAMES[status]}
          </span>
        </div>

        <span className="column-count">
          {tickets.length}
        </span>
      </div>

      <div className="column-body" ref={bodyRef} >

        <div
          className={`drop-zone ${dragOver && canDrop ? "drag-allowed" : ""} ${dragOver && !canDrop ? "drag-denied" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >

          {tickets.length === 0 ? (
            <div className="empty-state">
              {STATUS_EMPTY[status]}
            </div>
          ) : (
            <>

              {tickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  draggable
                  onDragStart={() => onDragStart(ticket)}
                  onMove={onMove}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}

              <div ref={loaderRef} style={{ height: 20 }} />

              {loading && (
                <div className="column-loading">
                  Загрузка...
                </div>
              )}

            </>
          )}

        </div>

      </div>

    </div>
  );

}