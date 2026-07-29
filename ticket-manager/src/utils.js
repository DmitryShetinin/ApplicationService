export const employees = [
  { id: 'emp-1', name: 'Алексей Иванов', initials: 'АИ', department: 'Разработка' },
  { id: 'emp-2', name: 'Мария Петрова', initials: 'МП', department: 'Дизайн' },
  { id: 'emp-3', name: 'Дмитрий Соколов', initials: 'ДС', department: 'Разработка' },
  { id: 'emp-4', name: 'Елена Кузнецова', initials: 'ЕК', department: 'Маркетинг' },
  { id: 'emp-5', name: 'Сергей Волков', initials: 'СВ', department: 'Тестирование' },
];

export const departments = [...new Set(employees.map(e => e.department))];

export function generateId() {
  return 'ticket-' + crypto.randomUUID().split('-')[0];
}

export function formatDate(date) {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getDeadlineClass(deadlineStr) {
  const now = new Date();
  const deadline = new Date(deadlineStr);
  const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return 'deadline-overdue';
  if (diffDays < 2) return 'deadline-warning';
  return 'deadline-normal';
}

export function getDeadlineLabel(deadlineStr) {
  const now = new Date();
  const deadline = new Date(deadlineStr);
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `Просрочено (${Math.abs(diffDays)} дн.)`;
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Завтра';
  return `Через ${diffDays} дн.`;
}