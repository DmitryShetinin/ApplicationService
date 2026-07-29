
namespace Application.Features.Ticket.Requests;
public sealed record CreateTicketRequest(
    int Number,
    Guid AuthorId,
    Guid ExecutorId,
    string Description,
    DateTime Deadline);