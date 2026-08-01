using System.Reflection;
using Mapster;

public static class MapsterConfiguration
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig.GlobalSettings.Scan(
            Assembly.GetExecutingAssembly());
    }
}