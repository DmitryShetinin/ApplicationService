using Application.Features.Employees.Responses;
using Core.Enums;
using Core.Models;

namespace Application.Features.Tickets.Responses;

public sealed record TicketResponse(
Guid Id,
int Number,
EmployeeResponse AuthorName,
EmployeeResponse? ExecutorName,
string Description,
DateTime CreatedAt,
DateTime Deadline,
TicketStatus Status);
