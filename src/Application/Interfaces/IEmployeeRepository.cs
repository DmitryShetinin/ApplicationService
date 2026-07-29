using Core.Models;

namespace Application.Abstractions.Persistence;

public interface IEmployeeRepository
{
    Task<Employee?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken);


    Task<IReadOnlyCollection<Employee>> GetAllAsync(
        CancellationToken cancellationToken);


    Task AddAsync(
        Employee employee,
        CancellationToken cancellationToken);


    Task UpdateAsync(
        Employee employee,
        CancellationToken cancellationToken);
}