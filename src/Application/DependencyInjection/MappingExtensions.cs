

using Mapster;
using Microsoft.Extensions.DependencyInjection;

public static class MappingExtensions
{
    public static IServiceCollection AddMapping(
        this IServiceCollection services)
    {
        services.AddSingleton(
            TypeAdapterConfig.GlobalSettings);
        
        services.AddScoped<MapsterConfiguration>();

        return services;
    }
}