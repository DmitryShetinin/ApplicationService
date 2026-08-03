
using Application.Features.Notifications.Responses;
 
namespace Application.Features.Notifications;

 

public interface INotificationPublisher
{
    Task PublishAsync(
        TicketNotification notification,
        CancellationToken cancellationToken);


 
        
}

 