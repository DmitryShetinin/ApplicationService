using Core.Enums;

namespace Application.Features.Tickets.Requests;

public sealed record TicketFilterRequest(
TicketStatus? Status,
Guid? ExecutorId,
Guid? DepartmentId,
bool? OnlyOverdue,
int? Page = 1, 
int? PageSize = 12);
