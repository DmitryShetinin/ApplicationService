namespace Application.Features.Application.Requests;

public sealed record ApplicationFilterRequest(
ApplicationStatus? Status,
Guid? ExecutorId,
Guid? DepartmentId,
bool? OnlyOverdue);
