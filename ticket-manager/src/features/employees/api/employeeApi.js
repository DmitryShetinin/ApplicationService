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