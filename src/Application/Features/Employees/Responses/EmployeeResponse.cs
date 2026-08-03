namespace Application.Features.Employees.Responses;

public sealed record EmployeeResponse(
    Guid? Id,
    string firstName,
    string lastName,
    string? middleName,
    Guid? DepartmentId,
    string? Department,
    Guid? PositionId,
    string? Position);