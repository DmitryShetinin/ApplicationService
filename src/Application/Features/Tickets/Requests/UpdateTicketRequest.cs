


using Core.Enums;

namespace Application.Features.Tickets.Requests;

public sealed record UpdateTicketRequest(
    Guid? ExecutorId,
    string Description,
    DateTime Deadline,
    TicketStatus Status,
    int Version
);