using Core.Enums;

namespace Application.Features.Application.Requests;

public sealed record TicketFilterRequest(
TicketStatus? Status,
Guid? ExecutorId,
Guid? DepartmentId,
bool? OnlyOverdue);
