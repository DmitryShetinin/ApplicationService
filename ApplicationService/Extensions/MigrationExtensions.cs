using Infrastructure;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApplicationService.Extensions;

public static class MigrationExtensions
{
    public static async Task ApplyMigrationsAsync(
        this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var db =
            scope.ServiceProvider
                .GetRequiredService<AppDbContext>();

        await db.Database.MigrateAsync();
        await db.SeedAsync();
    }
}