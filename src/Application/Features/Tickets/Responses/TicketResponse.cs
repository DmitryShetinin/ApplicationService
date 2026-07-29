using Core.Models;

namespace Application.Features.Application.Responses;

public sealed record TicketResponse(
Guid Id,
int Number,
Employee AuthorName,
Employee? ExecutorName,
string Description,
DateTime CreatedAt,
DateTime Deadline,
TicketEvent Status);
