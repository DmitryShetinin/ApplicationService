namespace Application.Features.Employees.Responses;

public sealed record EmployeeResponse(
    Guid Id,
    string FullName,
    Guid DepartmentId,
    string Department,
    Guid PositionId,
    string Position);