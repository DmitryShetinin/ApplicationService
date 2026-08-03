
using Application.Features.Tickets.Responses;

namespace Application.Abstractions.Notifications;

public interface ITicketNotifier
{
    Task TicketCreated(
        TicketResponse ticket,
        CancellationToken cancellationToken);


    Task TicketUpdated(
        TicketResponse ticket,
        CancellationToken cancellationToken);


    Task TicketDeleted(
        Guid ticketId,
        CancellationToken cancellationToken);
}