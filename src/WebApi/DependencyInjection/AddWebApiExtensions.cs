


using Application.Abstractions.Notifications;
using Application.Features.Notifications;
using Microsoft.Extensions.DependencyInjection;
using WebApi.Notifications;

public static class NotificationExtensions
{
  public static IServiceCollection AddWebApi(
      this IServiceCollection services)
  {


    services.AddSignalR();

    services.AddScoped<
        INotificationPublisher,
        SignalRNotificationPublisher>();

    services.AddSignalR();
    services.AddScoped<
        ITicketNotifier,
        SignalRTicketNotifier>();

    return services;


  }
}
