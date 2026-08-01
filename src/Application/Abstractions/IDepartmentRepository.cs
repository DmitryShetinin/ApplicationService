using Core.ValueObjects;


namespace Application.Abstractions.Persistence;


public interface IDepartmentRepository
{
    Task<Department?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);
}

