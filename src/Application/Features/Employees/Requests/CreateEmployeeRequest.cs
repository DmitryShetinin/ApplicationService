using Core.ValueObjects;

namespace Application.Features.Employees.Requests;

public sealed record CreateEmployeeRequest(
    FullName FullName,
    Guid DepartmentId,
    Guid PositionId);