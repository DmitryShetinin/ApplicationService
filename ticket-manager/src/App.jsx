import { useState, useCallback } from 'react';
import Board from './components/Board.jsx';
import Modal from './components/Modal.jsx';
import Toast from './components/Toast.jsx';
import { employees, generateId, formatDate, getDeadlineClass, getDeadlineLabel } from './utils.js';

const STATUS = { New: 1, Processing: 2, Completed: 3 };
const STATUS_LABELS = { 1: 'Новый', 2: 'В работе', 3: 'Завершён' };

export default function App() {
  const [tickets, setTickets] = useState(seedTickets());
  const [nextNumber, setNextNumber] = useState(107);
  const [modal, setModal] = useState(null); // { type: 'create'|'edit', ticket? }
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  }, []);

  const openCreateModal = () => setModal({ type: 'create' });
  const openEditModal = (ticket) => setModal({ type: 'edit', ticket });
  const closeModal = () => setModal(null);

  const handleSave = (formData) => {
    if (modal?.type === 'edit' && modal.ticket) {
      setTickets(prev => prev.map(t => {
        if (t.id === modal.ticket.id) {
          return {
            ...t,
            description: formData.description,
            authorId: formData.authorId,
            executorId: formData.executorId,
            status: formData.status,
            deadline: formData.deadline,
            completedAt: formData.status === STATUS.Completed ? new Date().toISOString() : t.completedAt,
          };
        }
        return t;
      }));
      addToast(`Тикет #${modal.ticket.number} обновлён`, 'success');
    } else {
      const newTicket = {
        id: generateId(),
        number: nextNumber,
        createdAt: new Date().toISOString(),
        authorId: formData.authorId,
        executorId: formData.executorId,
        description: formData.description,
        deadline: formData.deadline,
        status: formData.status,
        completedAt: formData.status === STATUS.Completed ? new Date().toISOString() : null,
      };
      setTickets(prev => [newTicket, ...prev]);
      setNextNumber(n => n + 1);
      addToast(`Тикет #${newTicket.number} создан`, 'success');
    }
    closeModal();
  };

  const moveTicket = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId && t.status !== newStatus) {
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === STATUS.Completed ? new Date().toISOString() : t.completedAt,
        };
      }
      return t;
    }));
  };

  const deleteTicket = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && confirm(`Удалить тикет #${ticket.number}?`)) {
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      addToast(`Тикет #${ticket.number} удалён`, 'info');
    }
  };

  const counts = {
    1: tickets.filter(t => t.status === 1).length,
    2: tickets.filter(t => t.status === 2).length,
    3: tickets.filter(t => t.status === 3).length,
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">TM</div>
          <div>
            <div className="header-title">Ticket Manager</div>
            <div className="header-subtitle">Kanban Board</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="stats-pill"><span className="stats-dot dot-new" /> Новые: <strong>{counts[1]}</strong></div>
          <div className="stats-pill"><span className="stats-dot dot-processing" /> В работе: <strong>{counts[2]}</strong></div>
          <div className="stats-pill"><span className="stats-dot dot-completed" /> Завершено: <strong>{counts[3]}</strong></div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Новый тикет
          </button>
        </div>
      </header>

      <Board tickets={tickets} onMove={moveTicket} onDelete={deleteTicket} onEdit={openEditModal} />

      {modal && (
        <Modal
          type={modal.type}
          ticket={modal.ticket}
          employees={employees}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}

function seedTickets() {
  const now = new Date();
  return [
    { id: generateId(), number: 100, createdAt: subDays(now, 2), authorId: 'emp-1', executorId: 'emp-2', description: 'Разработать API для авторизации пользователей через OAuth 2.0', deadline: addDays(now, 5), status: 1 },
    { id: generateId(), number: 101, createdAt: subDays(now, 1), authorId: 'emp-3', executorId: 'emp-4', description: 'Сверстать лендинг по новому макету из Figma', deadline: addDays(now, 2), status: 1 },
    { id: generateId(), number: 102, createdAt: subDays(now, 3), authorId: 'emp-2', executorId: 'emp-1', description: 'Настроить CI/CD пайплайн в GitHub Actions', deadline: addDays(now, 1), status: 2 },
    { id: generateId(), number: 103, createdAt: subDays(now, 4), authorId: 'emp-5', executorId: 'emp-3', description: 'Оптимизировать запросы к БД — убрать N+1 problem', deadline: addDays(now, -0.5), status: 2 },
    { id: generateId(), number: 104, createdAt: subDays(now, 7), authorId: 'emp-4', executorId: 'emp-5', description: 'Написать unit-тесты для сервиса уведомлений', deadline: addDays(now, -1), status: 3, completedAt: subDays(now, 0.8) },
    { id: generateId(), number: 105, createdAt: subDays(now, 10), authorId: 'emp-1', executorId: 'emp-2', description: 'Обновить зависимости проекта', deadline: addDays(now, -3), status: 3, completedAt: subDays(now, 2) },
  ];
}

function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d.toISOString(); }
function subDays(date, days) { return addDays(date, -days); }