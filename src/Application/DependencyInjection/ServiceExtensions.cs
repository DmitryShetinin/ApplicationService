using Application.Features.Employees;
using Application.Features.Tickets;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceExtensions
{
    public static IServiceCollection AddServices(
        this IServiceCollection services)
    {
        services.AddScoped<ITicketService, TicketService>();
        services.AddScoped<IEmployeeService, EmployeeService>();

        return services;
    }
}