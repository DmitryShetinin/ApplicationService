
using Application.Features.Employees;
using Application.Features.Tickets;
using Core.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Application.DependencyInjection;

public static class DependencyInjection
{
  public static IServiceCollection AddApplication(
      this IServiceCollection services)
  {
   
    
    services.AddSingleton<TicketStateMachine>();
    services.AddScoped<ITicketService, TicketService>();
    services.AddScoped<IEmployeeService, EmployeeService>();
 
 
       

    return services;






  }
}
