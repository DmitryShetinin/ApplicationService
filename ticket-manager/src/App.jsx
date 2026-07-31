import { useState, useMemo, useCallback } from 'react';
import Board from './components/Board';
import Modal from './components/Modal';
import Toast from './components/Toast';
import Report from './components/Report';
import { employees, generateId } from './utils';

const STATUS = { New: 1, Processing: 2, Completed: 3 };
const STATUS_LABELS = { 1: 'Новый', 2: 'В работе', 3: 'Завершён' };

export default function App() {
  const [tickets, setTickets] = useState(seedTickets());
  const [nextNumber, setNextNumber] = useState(108);
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'grid' | 'employees' | 'report'

  // Состояние фильтров (для сетки)
  const [filterStatus, setFilterStatus] = useState('');
  const [filterExecutor, setFilterExecutor] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterOverdue, setFilterOverdue] = useState(false);

  // Фильтрация (только для сетки)
  const filteredTickets = useMemo(() => {
    if (viewMode !== 'grid') return tickets;
    return tickets.filter(ticket => {
      if (filterStatus && ticket.status !== parseInt(filterStatus)) return false;
      if (filterExecutor && ticket.executorId !== filterExecutor) return false;
      if (filterDepartment) {
        const exec = employees.find(e => e.id === ticket.executorId);
        if (!exec || exec.department !== filterDepartment) return false;
      }
      if (filterOverdue && new Date(ticket.deadline) >= new Date()) return false;
      return true;
    });
  }, [tickets, viewMode, filterStatus, filterExecutor, filterDepartment, filterOverdue]);

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
      setTickets(prev => prev.map(t =>
        t.id === modal.ticket.id
          ? {
              ...t,
              description: formData.description,
              authorId: formData.authorId,
              executorId: formData.executorId,
              status: formData.status,
              deadline: formData.deadline,
              completedAt: formData.status === STATUS.Completed ? new Date().toISOString() : t.completedAt,
            }
          : t
      ));
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
    setTickets(prev => prev.map(t =>
      t.id === ticketId && t.status !== newStatus
        ? { ...t, status: newStatus, completedAt: newStatus === STATUS.Completed ? new Date().toISOString() : t.completedAt }
        : t
    ));
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

  // Компонент сотрудников (таблица)
  const EmployeesTable = () => (
    <div className="content">
      <table className="employees-table">
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Подразделение</th>
            <th>Должность</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>
                <span className="emp-avatar">{emp.initials}</span>
                {emp.name}
              </td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">TM</div>
          <div>
            <div className="header-title">Ticket Manager</div>
            <div className="header-subtitle">
              {viewMode === 'kanban' ? 'Канбан' : viewMode === 'grid' ? 'Сетка' : viewMode === 'employees' ? 'Сотрудники' : 'Отчёт'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="stats-pill"><span className="stats-dot dot-new"/> Новые: <strong>{counts[1]}</strong></div>
          <div className="stats-pill"><span className="stats-dot dot-processing"/> В работе: <strong>{counts[2]}</strong></div>
          <div className="stats-pill"><span className="stats-dot dot-completed"/> Завершено: <strong>{counts[3]}</strong></div>
          
          <button className={`btn btn-ghost ${viewMode === 'kanban' ? 'active-filter' : ''}`} onClick={() => setViewMode('kanban')}>📋 Канбан</button>
          <button className={`btn btn-ghost ${viewMode === 'grid' ? 'active-filter' : ''}`} onClick={() => setViewMode('grid')}>📊 Сетка</button>
          <button className={`btn btn-ghost ${viewMode === 'employees' ? 'active-filter' : ''}`} onClick={() => setViewMode('employees')}>👥 Сотрудники</button>
          <button className={`btn btn-ghost ${viewMode === 'report' ? 'active-filter' : ''}`} onClick={() => setViewMode('report')}>📈 Отчёт</button>
          
          <button className="btn btn-primary" onClick={openCreateModal}>+ Новый тикет</button>
        </div>
      </header>

      {/* Панель фильтров — только в режиме сетки */}
      {viewMode === 'grid' && (
        <div className="filter-bar">
          <div className="filter-group">
            <label>Статус</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Все статусы</option>
              <option value="1">Новый</option>
              <option value="2">В работе</option>
              <option value="3">Завершён</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Исполнитель</label>
            <select value={filterExecutor} onChange={e => setFilterExecutor(e.target.value)}>
              <option value="">Все исполнители</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Подразделение</label>
            <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)}>
              <option value="">Все подразделения</option>
              {[...new Set(employees.map(e => e.department))].map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>
              <input type="checkbox" checked={filterOverdue} onChange={e => setFilterOverdue(e.target.checked)} />
              Только просроченные
            </label>
          </div>
          <button className="filter-reset" onClick={() => {
            setFilterStatus('');
            setFilterExecutor('');
            setFilterDepartment('');
            setFilterOverdue(false);
          }}>Сбросить</button>
        </div>
      )}

      {/* Условный рендеринг */}
      {viewMode === 'kanban' && (
        <Board tickets={tickets} viewMode="kanban" onMove={moveTicket} onDelete={deleteTicket} onEdit={openEditModal} />
      )}
      {viewMode === 'grid' && (
        <Board tickets={filteredTickets} viewMode="grid" onMove={moveTicket} onDelete={deleteTicket} onEdit={openEditModal} />
      )}
      {viewMode === 'employees' && <EmployeesTable />}
      {viewMode === 'report' && <Report tickets={tickets} employees={employees} />}

      {modal && (
        <Modal type={modal.type} ticket={modal.ticket} employees={employees} onSave={handleSave} onClose={closeModal} />
      )}
      <Toast toasts={toasts} />
    </div>
  );
}

function seedTickets() {
  const now = new Date();
  return [
    { id: generateId(), number: 100, createdAt: subDays(now,2), authorId:'emp-1', executorId:'emp-2', description:'Разработать API авторизации OAuth 2.0', deadline: addDays(now,5), status:1 },
    { id: generateId(), number: 101, createdAt: subDays(now,1), authorId:'emp-3', executorId:'emp-4', description:'Сверстать лендинг по Figma', deadline: addDays(now,-2), status:1 },
    { id: generateId(), number: 102, createdAt: subDays(now,3), authorId:'emp-2', executorId:'emp-1', description:'Настроить CI/CD', deadline: addDays(now,1), status:2 },
    { id: generateId(), number: 103, createdAt: subDays(now,4), authorId:'emp-5', executorId:'emp-3', description:'Оптимизировать БД', deadline: addDays(now,-1), status:2 },
    { id: generateId(), number: 104, createdAt: subDays(now,7), authorId:'emp-4', executorId:'emp-5', description:'Unit-тесты уведомлений', deadline: addDays(now,-1), status:3, completedAt: subDays(now,0.8) },
    { id: generateId(), number: 105, createdAt: subDays(now,10), authorId:'emp-1', executorId:'emp-2', description:'Обновить зависимости', deadline: addDays(now,-3), status:3, completedAt: subDays(now,2) },
    { id: generateId(), number: 106, createdAt: subDays(now,1), authorId:'emp-3', executorId:'emp-3', description:'Добавить тёмную тему', deadline: addDays(now,0), status:3, completedAt: subDays(now,0.5) },
  ];
}
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d.toISOString(); }
function subDays(date, days) { return addDays(date, -days); }