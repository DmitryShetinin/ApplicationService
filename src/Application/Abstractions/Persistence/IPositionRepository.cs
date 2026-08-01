using Core.ValueObjects;

namespace Application.Abstractions.Persistence;


public interface IPositionRepository
{
    Task<Position?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);
}

