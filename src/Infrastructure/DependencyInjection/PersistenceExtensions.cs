using Infrastructure.Configuration;
using Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Application.Abstractions.Persistence;
using Infrastructure.Persistence.Repositories;
using Application.Queries;
using Infrastructure.Queries;
using Core.Models;


public static class PersistenceExtensions
{
  public static IServiceCollection AddPersistence(
      this IServiceCollection services,
      IConfiguration configuration)
  {
    services.Configure<DatabaseOptions>(
        configuration.GetSection("Database"));


    services.AddDbContext<AppDbContext>(
        (sp, options) =>
        {
          var dbOptions =
                  sp.GetRequiredService<IOptions<DatabaseOptions>>()
                      .Value;


          options.UseNpgsql(
                  configuration.GetConnectionString("Default"),
                  npgsql =>
                  {
                    npgsql.CommandTimeout(
                            dbOptions.CommandTimeoutSeconds);
                  });
        });

  

    services.AddScoped<ITicketRepository, TicketRepository>();
    services.AddScoped<IEmployeeRepository, EmployeeRepository>();
    services.AddScoped<IUnitOfWork, UnitOfWork>();
    services.AddScoped<IDepartmentRepository, DepartmentRepository>();
    services.AddScoped<IPositionRepository, PositionRepository>();
    services.AddScoped<ITicketQueries, TicketQueries>();
    services.AddTransient<TicketStateMachine>();
    return services;
  }
}
