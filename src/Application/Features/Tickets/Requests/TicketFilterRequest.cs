using Core.Enums;

namespace Application.Features.Tickets.Requests;

public sealed record TicketFilterRequest(
TicketStatus? Status,
Guid? ExecutorId,
Guid? DepartmentId,
bool? OnlyOverdue);
