import { useState } from 'react';

const STATUSES = [
  { value: 1, label: 'Новый' },
  { value: 2, label: 'В работе' },
  { value: 3, label: 'Завершён' },
];

export default function Modal({ type, ticket, employees, onSave, onClose }) {
  const isEdit = type === 'edit' && ticket;
  const defaultDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [description, setDescription] = useState(isEdit ? ticket.description : '');
  const [authorId, setAuthorId] = useState(isEdit ? ticket.authorId : employees[0].id);
  const [executorId, setExecutorId] = useState(isEdit ? ticket.executorId : employees[1].id);
  const [status, setStatus] = useState(isEdit ? ticket.status : 1);
  const [deadline, setDeadline] = useState(isEdit ? new Date(ticket.deadline).toISOString().slice(0, 16) : defaultDeadline);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSave({
      description: description.trim(),
      authorId,
      executorId,
      status,
      deadline: new Date(deadline).toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? `Редактировать тикет #${ticket.number}` : 'Создать тикет'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Описание</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Опишите задачу…" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Автор</label>
              <select value={authorId} onChange={e => setAuthorId(e.target.value)}>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Исполнитель</label>
              <select value={executorId} onChange={e => setExecutorId(e.target.value)}>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Статус</label>
              <select value={status} onChange={e => setStatus(Number(e.target.value))}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Дедлайн</label>
              <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} required />
            </div>
          </div>
          <div className="modal-footer" style={{ marginTop: 'auto' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Сохранить' : 'Создать'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}