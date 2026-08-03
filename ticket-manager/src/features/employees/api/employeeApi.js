const API_URL = "http://localhost:5353/api/employees";

export async function getEmployees() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Не удалось получить сотрудников");
  }

  const employees = await response.json();

  return employees.map(employee => ({
    id: employee.id,
    name: employee.firstName + " " + employee.lastName + " " + employee.middleName,
    initials: employee.firstName[0] + employee.lastName[0],
    departmentId: employee.departmentId,
    department: employee.department,
    positionId: employee.positionId,
    position: employee.position
  }));
}