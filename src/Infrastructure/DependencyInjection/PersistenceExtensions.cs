using Infrastructure.Configuration;
using Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Application.Abstractions.Persistence;
using Infrastructure.Persistence.Repositories;
using Core.Models;



public static class PersistenceExtensions
{
  public static IServiceCollection AddPersistence(
      this IServiceCollection services,
      IConfiguration configuration)
  {
    services.Configure<DatabaseOptions>(
        configuration.GetSection("Database"));


    services.AddDbContextFactory<AppDbContext>(
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

    services.AddScoped<IUnitOfWork, UnitOfWork>();
    services.AddTransient<TicketStateMachine>();

    services.AddScoped<ITicketRepository, TicketRepository>();
    services.AddScoped<IEmployeeRepository, EmployeeRepository>();
    services.AddScoped<IDepartmentRepository, DepartmentRepository>();
    services.AddScoped<IPositionRepository, PositionRepository>();

   


 
    return services;
  }
}
