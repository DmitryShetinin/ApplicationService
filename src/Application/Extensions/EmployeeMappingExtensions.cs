using Application.Features.Employee.Responses;
using Core.Models;

namespace Application.Common.Extensions;

public static class EmployeeMappingExtensions
{
    public static EmployeeResponse ToResponse(
        this Employee employee)
    {
        return new EmployeeResponse(
            employee.Id,
            employee.FullName.ToString(),
            employee.DepartmentId,
            employee.Department.Name,
            employee.PositionId,
            employee.Position.Name);
    }
}