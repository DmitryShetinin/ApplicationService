


using Application.Features.Reports.Interfaces;
using Application.Queries;
using Infrastructure.Queries;
using Microsoft.Extensions.DependencyInjection;

public static class QueryExtensions
{
  public static IServiceCollection AddQueries(
      this IServiceCollection services)
  {
 
    services.AddScoped<IReportQueries, ReportQueries>();
    services.AddScoped<ITicketQueries, TicketQueries>();



    return services;
  }
}
