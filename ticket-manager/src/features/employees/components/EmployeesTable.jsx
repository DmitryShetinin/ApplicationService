export default function EmployeesTable({employees}) {
    return (
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
                    {employees.map(emp=>(
                        <tr key={emp.id}>
                            <td>
                                <span className="emp-avatar">
                                    {emp.initials}
                                </span>
                                {emp.name}
                            </td>

                            <td>
                                {emp.department}
                            </td>

                            <td>
                                {emp.position}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}