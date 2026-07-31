using Microsoft.EntityFrameworkCore;
using Application.Abstractions.Persistence;

namespace Infrastructure.Persistence;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }


    public async Task ExecuteAsync(
        Func<Task> action,
        CancellationToken token = default)
    {
        await using var transaction =
            await _context.Database
                .BeginTransactionAsync(token);

        try
        {
            await action();

            await _context.SaveChangesAsync(token);

            await transaction.CommitAsync(token);
        }
        catch
        {
            await transaction.RollbackAsync(token);

            throw;
        }
    }
}