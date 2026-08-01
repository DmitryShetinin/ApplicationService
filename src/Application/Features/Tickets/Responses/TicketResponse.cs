using Application.Features.Employees.Responses;
using Core.Enums;
using Core.Models;
using Core.ValueObjects;

namespace Application.Features.Tickets.Responses;
public sealed record EmployeeShortResponse(
    Guid Id,
    string FullName,
    string Department,
    string Position);

    
public sealed record TicketResponse(
    Guid Id,
    int Number,
    EmployeeShortResponse Author,
    EmployeeShortResponse? Executor,
    string Description,
    DateTime CreatedAt,
    DateTime Deadline,
    TicketStatus Status, 
    IReadOnlyCollection<TicketTransition> AllowedTransitions);
