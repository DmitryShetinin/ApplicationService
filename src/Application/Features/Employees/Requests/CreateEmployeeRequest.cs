 

namespace Application.Features.Employees.Requests;

public sealed record CreateEmployeeRequest(
    string FirstName,
    string LastName,
    string? MiddleName,
    Guid DepartmentId,
    Guid PositionId);