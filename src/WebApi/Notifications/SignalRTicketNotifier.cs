using Application.Abstractions.Notifications;
using Application.Features.Notifications.Responses;
using Application.Features.Tickets.Responses;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;

namespace WebApi.Notifications;

public sealed class SignalRTicketNotifier
    : ITicketNotifier
{
    private readonly IHubContext<TicketHub> _hub;


    public SignalRTicketNotifier(
        IHubContext<TicketHub> hub)
    {
        _hub = hub;
    }


    public async Task TicketCreated(
        TicketResponse ticket,
        CancellationToken cancellationToken)
    {
        await _hub.Clients.All.SendAsync(
            "TicketCreated",
            ticket,
            cancellationToken);
    }


    public async Task TicketUpdated(
        TicketResponse ticket,
        CancellationToken cancellationToken)
    {
        await _hub.Clients.All.SendAsync(
            "TicketUpdated",
            ticket,
            cancellationToken);
    }


    public async Task TicketDeleted(
        Guid ticketId,
        CancellationToken cancellationToken)
    {
        await _hub.Clients.All.SendAsync(
            "TicketDeleted",
            ticketId,
            cancellationToken);
    }
}