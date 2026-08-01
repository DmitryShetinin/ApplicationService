using Application.Abstractions.Persistence;
using Core.ValueObjects;

using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class PositionRepository : IPositionRepository
{
    private readonly AppDbContext _context;


    public PositionRepository(
        AppDbContext context)
    {
        _context = context;
    }


    public async Task<Position?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.Positions
            .FirstOrDefaultAsync(
                x => x.Id == id,
                cancellationToken);
    }
}