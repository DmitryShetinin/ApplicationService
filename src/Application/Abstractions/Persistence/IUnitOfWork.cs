namespace Application.Abstractions.Persistence;

public interface IUnitOfWork
{
    Task ExecuteAsync(
        Func<Task> action,
        CancellationToken token = default);


    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}