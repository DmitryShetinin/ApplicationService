
const API_URL = "http://localhost:5353/api/employees";

function getInitials(fullName) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map(x => x[0].toUpperCase())
    .join("");
}

export async function getEmployees() {
  const response = await fetch(API_URL);
  console.log(1)
  if (!response.ok) {
    throw new Error("Не удалось получить сотрудников");
  }

  const employees = await response.json();
  console.log(employees)
  return employees.map(employee => ({
    id: employee.id,
    name: employee.fullName,
    initials: getInitials(employee.fullName),

    departmentId: employee.departmentId,
    department: employee.department,

    positionId: employee.positionId,
    position: employee.position
  }));
}

export const employees = await getEmployees();



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


export async function changeTicketExecutor(ticketId, executorId) {
      const response = await fetch(
          `${API_URL}/${ticketId}/executor`,
          {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  executorId
              })
          });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
      }
  }

  export async function changeTicketStatus(ticketId, status) {
      const response = await fetch(
          `${API_URL}/${ticketId}/status`,
          {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  status
              })
          });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
      }
  }
  