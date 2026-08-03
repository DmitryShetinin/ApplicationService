
namespace Application.Features.Tickets.Requests;
public sealed record CreateTicketRequest(
    Guid AuthorId,
    Guid? ExecutorId,
    string Description,
    DateTime Deadline,
    Guid ClientRequestId);