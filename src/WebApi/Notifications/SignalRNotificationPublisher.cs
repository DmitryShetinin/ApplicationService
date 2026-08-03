using Application.Features.Notifications;
using Application.Features.Notifications.Responses;
using Application.Features.Tickets.Responses;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;




public sealed class SignalRNotificationPublisher
    : INotificationPublisher
{
    private readonly IHubContext<TicketHub> _hub;

    public SignalRNotificationPublisher(
        IHubContext<TicketHub> hub)
    {
        _hub = hub;
    }


    public async Task PublishAsync(
        TicketNotification notification,
        CancellationToken cancellationToken)
    {
        await _hub.Clients.All.SendAsync(
            "NotificationReceived",
            notification,
            cancellationToken
        );
    }


     
}


