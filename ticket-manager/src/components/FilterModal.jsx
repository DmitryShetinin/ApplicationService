import { useState, useEffect } from 'react';
import { employees, departments } from '../utils';

export default function FilterModal({
  show,
  filterStatus,
  filterExecutor,
  filterDepartment,
  filterOverdue,
  onFilterChange,
  onClose,
}) {
  // Локальное состояние для мгновенного применения при изменении
  const [localStatus, setLocalStatus] = useState(filterStatus);
  const [localExecutor, setLocalExecutor] = useState(filterExecutor);
  const [localDepartment, setLocalDepartment] = useState(filterDepartment);
  const [localOverdue, setLocalOverdue] = useState(filterOverdue);

  // Синхронизируем при открытии
  useEffect(() => {
    if (show) {
      setLocalStatus(filterStatus);
      setLocalExecutor(filterExecutor);
      setLocalDepartment(filterDepartment);
      setLocalOverdue(filterOverdue);
    }
  }, [show, filterStatus, filterExecutor, filterDepartment, filterOverdue]);

  // При изменении локального значения сразу применяем через родительский обработчик
  const handleStatusChange = (value) => {
    setLocalStatus(value);
    onFilterChange({ status: value, executor: localExecutor, department: localDepartment, overdue: localOverdue });
  };
  const handleExecutorChange = (value) => {
    setLocalExecutor(value);
    onFilterChange({ status: localStatus, executor: value, department: localDepartment, overdue: localOverdue });
  };
  const handleDepartmentChange = (value) => {
    setLocalDepartment(value);
    onFilterChange({ status: localStatus, executor: localExecutor, department: value, overdue: localOverdue });
  };
  const handleOverdueChange = (checked) => {
    setLocalOverdue(checked);
    onFilterChange({ status: localStatus, executor: localExecutor, department: localDepartment, overdue: checked });
  };

  const handleReset = () => {
    setLocalStatus('');
    setLocalExecutor('');
    setLocalDepartment('');
    setLocalOverdue(false);
    onFilterChange({ status: '', executor: '', department: '', overdue: false });
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal filter-modal">
        <div className="modal-header">
          <h3>Фильтры</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="filter-group">
            <label>Статус</label>
            <select value={localStatus} onChange={e => handleStatusChange(e.target.value)}>
              <option value="">Все статусы</option>
              <option value="1">Новый</option>
              <option value="2">В работе</option>
              <option value="3">Завершён</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Исполнитель</label>
            <select value={localExecutor} onChange={e => handleExecutorChange(e.target.value)}>
              <option value="">Все исполнители</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Подразделение</label>
            <select value={localDepartment} onChange={e => handleDepartmentChange(e.target.value)}>
              <option value="">Все подразделения</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={localOverdue}
                onChange={e => handleOverdueChange(e.target.checked)}
              />
              Только просроченные
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={handleReset}>Сбросить</button>
          <button className="btn btn-primary" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}