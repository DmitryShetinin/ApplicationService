import { useMemo } from 'react';

export default function Report({ tickets, employees }) {
  const reportData = useMemo(() => {
    const now = new Date();
    const byStatus = { 1: 0, 2: 0, 3: 0 };
    let overdueCount = 0;
    const completedByExecutor = {};

    employees.forEach(emp => {
      completedByExecutor[emp.id] = 0;
    });

    tickets.forEach(ticket => {
      byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1;
      if (ticket.status !== 3 && new Date(ticket.deadline) < now) {
        overdueCount++;
      }
      if (ticket.status === 3) {
        completedByExecutor[ticket.executorId] = (completedByExecutor[ticket.executorId] || 0) + 1;
      }
    });

    return { byStatus, overdueCount, completedByExecutor };
  }, [tickets, employees]);

  const downloadReport = () => {
    let text = 'Отчёт по заявкам\n\n';
    text += `Новые: ${reportData.byStatus[1]}\n`;
    text += `В работе: ${reportData.byStatus[2]}\n`;
    text += `Завершено: ${reportData.byStatus[3]}\n`;
    text += `Просроченные: ${reportData.overdueCount}\n\n`;
    text += 'Выполненные заявки по исполнителям:\n';
    employees.forEach(emp => {
      text += `${emp.name} (${emp.department}): ${reportData.completedByExecutor[emp.id] || 0}\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `отчёт_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="content">
      <div className="report-card">
        <h2>📈 Отчёт по заявкам</h2>

        <div className="report-section">
          <h3>Количество заявок по статусам</h3>
          <div className="report-row">
            <span>Новые</span>
            <span className="badge badge-blue">{reportData.byStatus[1]}</span>
          </div>
          <div className="report-row">
            <span>В работе</span>
            <span className="badge badge-orange">{reportData.byStatus[2]}</span>
          </div>
          <div className="report-row">
            <span>Завершено</span>
            <span className="badge badge-green">{reportData.byStatus[3]}</span>
          </div>
        </div>

        <div className="report-section">
          <h3>Просроченные заявки</h3>
          <div className="report-row">
            <span>Просрочено (не завершены, дедлайн прошёл)</span>
            <span className="badge badge-red">{reportData.overdueCount}</span>
          </div>
        </div>

        <div className="report-section">
          <h3>Выполненные заявки по исполнителям</h3>
          {employees.map(emp => (
            <div className="report-row" key={emp.id}>
              <span>{emp.name} ({emp.department})</span>
              <span className="badge badge-green">{reportData.completedByExecutor[emp.id] || 0}</span>
            </div>
          ))}
        </div>

        <button className="btn-download" onClick={downloadReport}>
          📥 Скачать отчёт (.txt)
        </button>
      </div>
    </div>
  );
}