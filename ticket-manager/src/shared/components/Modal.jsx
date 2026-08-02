import { useEffect, useState } from "react";

const STATUSES = {
  1: "Новый",
  2: "В работе",
  3: "Завершён"
};

export default function Modal({
  type,
  ticket,
  employees = [],
  onSave,
  onClose
}) {
  const isEdit = type === "edit" && !!ticket;
  const defaultDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0,16);

  const [description, setDescription] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [executorId, setExecutorId] = useState("");
  const [status, setStatus] = useState(1);
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [statusOptions, setStatusOptions] = useState([1,2,3]); // по умолчанию все

  useEffect(() => {
    if (!ticket) {
      // Если создаём новый тикет, показываем все статусы
      setStatusOptions([1,2,3]);
      // Сброс полей
      setDescription("");
      setAuthorId("");
      setExecutorId("");
      setStatus(1);
      setDeadline(defaultDeadline);
      return;
    }

    // Заполняем поля из ticket
    setDescription(ticket.description ?? "");
    setAuthorId(ticket.author?.id ?? "");
    setExecutorId(ticket.executor?.id ?? "");
    const currentStatus = Number(ticket.status ?? 1);
    setStatus(currentStatus);
    setDeadline(
      ticket.deadline
        ? new Date(ticket.deadline).toISOString().slice(0,16)
        : defaultDeadline
    );

    // Собираем уникальные статусы: текущий + все переходы
    const transitions = ticket.allowedTransitions ?? [];
    const statusSet = new Set([currentStatus]);
    transitions.forEach(t => statusSet.add(t.status));
    const sorted = Array.from(statusSet).sort((a,b) => a-b);
    setStatusOptions(sorted);
  }, [ticket]); // ticket не меняется внутри модалки, поэтому список фиксирован

  const getEmployeeName = (employee) => {
    return (
      employee.fullName ??
      employee.name ??
      employee.firstName ??
      "Без имени"
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSave({
      description: description.trim(),
      authorId,
      executorId,
      status,
      deadline: new Date(deadline).toISOString()
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="modal">
        <div className="modal-header">
          <h3>
            {isEdit
              ? `Редактировать тикет #${ticket.number}`
              : "Создать тикет"}
          </h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите задачу..."
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Автор</label>
              <select value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {getEmployeeName(emp)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Исполнитель</label>
              <select value={executorId} onChange={(e) => setExecutorId(e.target.value)}>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {getEmployeeName(emp)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Статус</label>
              <select value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                {statusOptions.map(s => (
                  <option key={s} value={s}>
                    {STATUSES[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Дедлайн</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}