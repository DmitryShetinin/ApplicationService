using Core.ValueObjects;

namespace Application.Features.Employees.Requests;

public sealed record CreateEmployeeRequest(
    FullName FullName,
    Department Department,
    Position Position);