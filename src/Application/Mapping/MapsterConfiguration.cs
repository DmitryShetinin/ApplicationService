using System.Reflection;
using Mapster;

public class MapsterConfiguration
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig.GlobalSettings.Scan(
            Assembly.GetExecutingAssembly());
    }
}