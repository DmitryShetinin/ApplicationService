
 
using Core.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Application.DependencyInjection;

public static class DependencyInjection
{
  public static IServiceCollection AddApplication(
      this IServiceCollection services)
  {
   
    services
        .AddServices()
        .AddMapping();

    MapsterConfiguration.RegisterMappings();
    services.AddSingleton<TicketStateMachine>();
 
     
 
       

    return services;






  }
}
