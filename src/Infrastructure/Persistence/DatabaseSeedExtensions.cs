using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public static class DatabaseSeedExtensions
{
    public static async Task SeedAsync(
        this AppDbContext db)
    {
        var path = Path.Combine(
            AppContext.BaseDirectory,
            "Persistence",
            "Scripts",
            "seed.sql");


        if (!File.Exists(path))
        {
            throw new FileNotFoundException(
                $"Seed file not found: {path}");
        }


        var sql = await File.ReadAllTextAsync(path);

        db.Database.SetCommandTimeout(
                TimeSpan.FromMinutes(10));
                
        await db.Database.ExecuteSqlRawAsync(sql);
    }
}